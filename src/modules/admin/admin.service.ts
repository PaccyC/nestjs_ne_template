import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto';
import * as bcrypt from "bcryptjs"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {

    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService
    ){}

        async createAdmin(createUserDto: CreateAdminDto){
    
            try {
                
                const existingUser= await this.prismaService.user.findUnique({
                    where:{
                        email: createUserDto.email
                    }
                })
                
                if(existingUser){
                    throw new BadRequestException("User already exists")
                }
    
                // Create a new admin in the database
    
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(createUserDto.password,salt);
    
                createUserDto.password= hashedPassword;
                const newAdmin= await this.prismaService.user.create({
                    data:{
                       ...createUserDto,
                       role: "ADMIN"
                    }
                })
               
                return { newAdmin};
            } catch (error) {
                throw new InternalServerErrorException(error)
            }
    
    
    
        }
    



}
