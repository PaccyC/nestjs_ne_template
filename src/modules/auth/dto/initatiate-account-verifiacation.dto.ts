import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class InitiateAccountVerificationDto{

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string;

}