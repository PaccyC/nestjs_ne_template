import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto';
import ApiResponse from 'src/utils/ApiResponse';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('admin')
export class AdminController {

    constructor(
        private readonly adminService: AdminService
    ){}


    @Post("/register")
    @UseGuards(AdminGuard)
    async createAdmin(
        @Body() createAdminDto: CreateAdminDto
    ){
        const response= await this.adminService.createAdmin(createAdminDto);
        return ApiResponse.success("Admin Registered successfully",201,response)
    }
}
