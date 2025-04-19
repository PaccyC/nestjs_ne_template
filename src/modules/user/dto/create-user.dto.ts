import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";



export class CreateUserDto {


    @IsNotEmpty({message:"Firstname is required"})
    @IsString()
    @MinLength(3)
    firstName: string;

    @IsNotEmpty({message:"Lastname is required"})
    @IsString()
    @MinLength(3)
    lastName: string;

    @IsNotEmpty({message:"email is required"})
    @IsString()
    @IsEmail({},{message:"Email should be a valid email address"})
    email: string;

    @IsNotEmpty({message:"Password is required"})
    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
        message: 'Password must have at least 8 characters, one symbol, one number, and one uppercase letter.',
    })
    password: string;

    @IsNotEmpty({message:"Password is required"})
    @IsString()
    @Matches(/^\+250\d{9}$/, {
        message: 'Mobile number must start with "+250" and have 9 digits after that.',
    })
    phoneNumber: string;

}