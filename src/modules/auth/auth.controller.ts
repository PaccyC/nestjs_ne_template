import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import ApiResponse from 'src/utils/ApiResponse';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post("login")
     async login(
        @Body() loginDto: LoginDto
    ){
        const response= await this.authService.login(loginDto)
        return ApiResponse.success("User logged in successfully",response)
    }
}
