import { IsEmail, IsNotEmpty, IsString } from "class-validator";




export class InitiatePasswordResetDto{

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string;

}