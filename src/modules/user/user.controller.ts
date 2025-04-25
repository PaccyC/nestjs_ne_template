import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserService } from './user.service';
import { ApiParam, ApiProperty } from '@nestjs/swagger';
import ApiResponse from 'src/utils/ApiResponse';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('user')
export class UserController {

    constructor( private userService: UserService){}

    @Post("/signup")
    async createUser( @Body() createUserDto: CreateUserDto){

        const response= await this.userService.createUser(createUserDto);
        return  ApiResponse.success("User registered successfully",201,response)
    }

    @Get(":id")
    @UseGuards(AuthGuard)
    @ApiProperty({name:"id", required: true})

   async findUserById(
        @Param("id") id: string
    ){
        const response= this.userService.findById(id);
        return  ApiResponse.success("User retrieved successfully",200,response)

    }

    @ApiParam({name:"query",required: true})
    @Get("search/:query")
    async searchUser(
       @Param() query: string){
        const response= this.userService.search(query)
        return  ApiResponse.success("Search is successful",200,response)
    }

    @Delete("delete/:id")
    @ApiProperty({name:"id",required: true})
    @UseGuards(AdminGuard)
    async deleteAccount(
        @Param("id") id: string
    ){

        const response= await this.userService.deleteAccount(id);
        return ApiResponse.success("Account deleted successfully",204,response)
    }


    @Get("/")
    async findUserByVerificationCode(@Param("verificationCode") verificationCode: string){
        const response = await this.userService.findUserByVerificationCode(verificationCode);
        return ApiResponse.success("User successfully retrieved",200,response);
    }

}
