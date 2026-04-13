import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { RolesGuard } from '../middlewares/roles.guard';
import { Roles } from '../helpers/roles.decorator';
import { successResponse } from '../helpers/response.helper';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async dashboard() {
    const data = await this.adminService.getDashboard();
    return successResponse(data);
  }

  @Get('users')
  async getUsers() {
    const data = await this.adminService.getUsers();
    return successResponse(data);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
    return successResponse(null, 'User deleted');
  }

  @Get('invitations')
  async getInvitations() {
    const data = await this.adminService.getInvitations();
    return successResponse(data);
  }
}
