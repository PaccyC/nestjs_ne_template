import { BadRequestException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { MailService } from '../mail/mail.service';
import {  InitiateAccountVerificationDto, InitiatePasswordResetDto, LoginDto } from './dto';
import { UserService } from '../user/user.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly prismaService:PrismaService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly userService: UserService
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

    async initiateAccountVerification(initateAccountVerificatioDto: InitiateAccountVerificationDto){
        try {
            
            const user = await this.prismaService.user.findUnique({
                where:{
                    email: initateAccountVerificatioDto.email
                }
            });
            if(!user) throw new BadRequestException("Invalid email, please use a registered email")
            
                // When code is already sent and not yet expired
            if(user.verificationStatus =="PENDING" && (user.verificationExpires!.getTime() > Date.now())){
                throw new HttpException("Account verification is already initiated",400)
            }
            const verificationCode= Math.floor(100000 + Math.random() * 900000).toString();
            user.verificationCode= verificationCode;

           await this.prismaService.user.update({
                where:{
                    email: user.email
                },
                data:{
                    verificationCode,
                    verificationExpires: new Date(Date.now() + 600000),
                    verificationStatus: "PENDING"
                }

            })
            const names = user.firstName + " " + user.lastName;
            // Then send the email
            await this.mailService.sendInitiateAccountVerificationEmail({toEmail:user.email,names,verificationCode})
            
        } catch (error) {
            console.error("error",error)
            throw new InternalServerErrorException(error)
        }
    }


    async verifyAccount(code: string) {
        try {
            
            const user= await this.userService.findUserByVerificationCode(code);
            if(!user) throw new HttpException("User not found",400);

            // check if verification code has not expired
            const isVerificationCodeExpired = user.verificationExpires && user.verificationExpires.getTime() < Date.now();
            if(isVerificationCodeExpired) throw new BadRequestException("Verification code has expired, please try getting another one");
            await this.prismaService.user.update({
                where:{
                    email:user.email
                },
                data:{
                    verificationCode: null,
                    verificationExpires: null,
                    verificationStatus:"VERIFIED"
                }
            })
            const names = user.firstName + " " + user.lastName;
            await this.mailService.sendAccountVerifiedEmail({toEmail: user.email,names})
        } catch (error) {
            console.error("error: ",error)
            throw new InternalServerErrorException("Error while verifying account "+ error)
        }
    }


    async initiatePasswordReset(initiatePasswordResetDto:InitiatePasswordResetDto){
        try {

            const user= await this.prismaService.user.findUnique({
                where:{
                    email: initiatePasswordResetDto.email
                }
            })
            
            if(!user) throw new BadRequestException("Try using another registered email");

            const passwordResetCode= Math.floor(100000 + Math.random() * 900000).toString();
           await this.prismaService.user.update({
                where:{
                    email: user.email
                },
                data:{
                    passwordResetCode,
                    passwordResetExpires: new Date( Date.now() + 600000),
                    passwordResetStatus: "PENDING"
                }
            })

            const names = user.firstName + " " + user.lastName;

            await this.mailService.sendInitiatePasswordResetEmail({toEmail:user.email,names, token: passwordResetCode})
            
        } catch (error) {
            console.error("error: ",error);
            throw new InternalServerErrorException("Error while initiating password reset "+error)
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto){

        try {
            
            const user= await this.prismaService.user.findUnique({
                where:{
                    email:resetPasswordDto.email
                }
            })
            if(!user) throw new BadRequestException("User not found")

            const isPasswordResetCodeExpired= user.passwordResetExpires && user.passwordResetExpires.getTime() < Date.now();
            if(isPasswordResetCodeExpired) throw new BadRequestException("Reset code has expired");

            if(user.passwordResetCode != resetPasswordDto.resetCode ){
                throw new BadRequestException("Invalid password reset code, please use a given reset code")
            }

            const salt= await bcrypt.genSalt(10);
            const hashedPassword= await bcrypt.hash(resetPasswordDto.newPassword,salt);
            await this.prismaService.user.update({
                where:{
                    email: user.email
                },
                data:{
                    password: hashedPassword
                }
            })
            const names = user.firstName + " " + user.lastName;
            await this.mailService.sendPasswordResetSuccessfullEmail({toEmail:user.email,names})
        } catch (error) {
            console.error("error: ",error)
            throw new InternalServerErrorException("Error while resetting password")
        }
    }
}
