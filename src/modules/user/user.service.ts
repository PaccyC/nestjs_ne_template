import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { Prisma } from 'generated/prisma';
import { paginator } from 'src/pagination/paginator';

@Injectable()
export class UserService {

    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService
    ){}




    async createUser(createUserDto: CreateUserDto){

        try {
            
            const existingUser= await this.prismaService.user.findUnique({
                where:{
                    email: createUserDto.email
                }
            })
            
            if(existingUser){
                throw new BadRequestException("User already exists")
            }

            // Create a new user in the database

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(createUserDto.password,salt);

            createUserDto.password= hashedPassword;
            const newUser= await this.prismaService.user.create({
                data:{
                   ...createUserDto,
                   role: "USER"
                }
            })
            const payload={
                id: newUser.id,
                email: newUser.email
            }

            const  token= await this.jwtService.signAsync(payload,{
                secret: process.env.JWT_SECRET_KEY,
                expiresIn:"6h"
            });
            return { newUser,token};
        } catch (error) {
            throw new InternalServerErrorException(error)
        }



    }


    async findById(id: string){
        try {
            const user= await this.prismaService.user.findUnique({
                where: {
                    id,
                    
                },
                include:{
                    profilePicture: true
                }
            })
            if(!user){
                throw new NotFoundException("User not found!")
            }
            return user;
            
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error")
        }
    }

    async search(query: string){
        try {
            
            const where: Prisma.UserWhereInput = {
                OR:[
                   { email: {contains: query,mode: "insensitive"}},
                   {firstName: {contains: query,mode: "insensitive"}},
                   {lastName: {contains: query,mode: "insensitive"}},
                   {phoneNumber: {contains: query,mode: "insensitive"}}
                ]
            }
            const [users, total]= await this.prismaService.$transaction([
               
                this.prismaService.user.findMany({
                    where,
                    take:5,
                    skip:0,
                    orderBy: { createdAt: 'desc' },
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      profilePicture: true,
                    },
                  }),
    
                 this.prismaService.user.count({where})
    
            ])
            return {users, meta: paginator({ page: Number(0), limit: Number(5), total }) }
        } 

        catch(error){
             throw new InternalServerErrorException("Internal Server Error! "+ error)
        }
    }
    async deleteAccount(id: string){
        try {
            await this.prismaService.user.delete({
                where:{
                    id
                }
            })
            
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error")
        }
    }


}
