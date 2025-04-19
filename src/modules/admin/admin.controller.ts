import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto';
import ApiResponse from 'src/utils/ApiResponse';

@Controller('admin')
export class AdminController {

    constructor(
        private readonly adminService: AdminService
    ){}


    @Post("/register")
    async createAdmin(
        @Body() createAdminDto: CreateAdminDto
    ){
        const response= await this.adminService.createAdmin(createAdminDto);
        return ApiResponse.success("Admin Registered successfully",response)
    }
}
