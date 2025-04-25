import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class ResetPasswordDto{

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    resetCode: string

    @IsString()
    @IsNotEmpty()
    newPassword: string

}