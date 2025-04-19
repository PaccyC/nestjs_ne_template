import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {

    constructor(
        private prismaService:PrismaService,
        private jwtService: JwtService
    ){}

    async login(loginDto: LoginDto){

        try {
            
            const user= await this.prismaService.user.findUnique({
                where:{
                    email: loginDto.email
                }
            });

            if(!user){
                throw new UnauthorizedException("Invalid Credentials")
            }

            const match= await bcrypt.compare(loginDto.password,user.password);
            if(!match){
                throw new UnauthorizedException("Invalid Credentials")
            }

            // Generate token for the user

            const payload= {
                id: user.id,
                email: user.email
            };

            const token= await this.jwtService.signAsync(payload,{
                secret:process.env.JWT_SECRET_KEY,
                expiresIn: '6h'
            });
            return { user,token}

        } catch (error) {
            console.log(error);
            
        }
    }
}
