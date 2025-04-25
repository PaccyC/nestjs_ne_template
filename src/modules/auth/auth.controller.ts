import { Body, Controller, Post, Put, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import ApiResponse from 'src/utils/ApiResponse';
import { InitiateAccountVerificationDto, InitiatePasswordResetDto, LoginDto, VerifyAccountDto } from './dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post("/login")
     async login(
        @Body() loginDto: LoginDto
    ){
        
            const response= await this.authService.login(loginDto)
            return ApiResponse.success("User logged in successfully",200,response)
            
    
    }


    @Put("/initiate-account-verification")
    async initiateAccountVerification(
        @Body() initiateAccountVerificationDto:InitiateAccountVerificationDto
    ){

        const response=await this.authService.initiateAccountVerification(initiateAccountVerificationDto)
        return ApiResponse.success("Account Verification initiated successfully",201,response);
    }

    @Put("/verify-account")
    async verifyAccount(
        @Body() verifyAccountDto: VerifyAccountDto
    ){

        const response=await this.authService.verifyAccount(verifyAccountDto.verificationCode)
        return ApiResponse.success("Account Verification completed successfully",201,response);
    }


    @Put("/initiate-password-reset")
    async initiatePasswordReset(
        @Body() initiatePasswordResetDto:InitiatePasswordResetDto
    ){
        const response= await this.authService.initiatePasswordReset(initiatePasswordResetDto)
        return ApiResponse.success("Password reset successfully initiated",200,response)
    }


    @Put("/reset-password")
    async resetPassword(
        @Body() resetPasswordDto:ResetPasswordDto

    ){
        const response= await this.authService.resetPassword(resetPasswordDto)
        return ApiResponse.success("Password reset successfully completed",201,response)
    }

}
