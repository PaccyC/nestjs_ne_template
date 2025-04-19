import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserService } from './user.service';
import { ApiParam, ApiProperty } from '@nestjs/swagger';
import ApiResponse from 'src/utils/ApiResponse';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('user')
export class UserController {

    constructor( private userService: UserService){}

    @Post("/signup")
    async createUser( @Body() createUserDto: CreateUserDto){

        const response= await this.userService.createUser(createUserDto);
        return  ApiResponse.success("User registered successfully",response)
    }

    @Get(":id")
    @UseGuards(AuthGuard)
    @ApiProperty({name:"id", required: true})

   async findUserById(
        @Param("id") id: string
    ){
        const response= this.userService.findById(id);
        return  ApiResponse.success("User retrieved successfully",response)

    }

    @ApiParam({name:"query",required: true})
    @Get("search/:query")
    async searchUser(
       @Param() query: string){
        const response= this.userService.search(query)
        return  ApiResponse.success("Search is successful",response)
    }

    @Delete("delete/:id")
    @ApiProperty({name:"id",required: true})
    async deleteAccount(
        @Param("id") id: string
    ){

        const response= await this.userService.deleteAccount(id);
        return ApiResponse.success("Account deleted successfully",response)
    }

}
