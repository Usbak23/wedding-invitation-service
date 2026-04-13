import {
  Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards,
} from '@nestjs/common';
import { InvitationService } from '../services/invitation.service';
import { CreateInvitationDto, UpdateInvitationDto } from '../validators/invitation.dto';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { successResponse } from '../helpers/response.helper';

@Controller('api/invitations')
@UseGuards(JwtAuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get()
  async findAll(@Req() req: any) {
    const data = await this.invitationService.findAll(req.user.id);
    return successResponse(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const data = await this.invitationService.findOne(id, req.user.id);
    return successResponse(data);
  }

  @Post()
  async create(@Body() dto: CreateInvitationDto, @Req() req: any) {
    const data = await this.invitationService.create(dto, req.user.id);
    return successResponse(data, 'Invitation created');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateInvitationDto, @Req() req: any) {
    const data = await this.invitationService.update(id, dto, req.user.id);
    return successResponse(data, 'Invitation updated');
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.invitationService.delete(id, req.user.id);
    return successResponse(null, 'Invitation deleted');
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string, @Req() req: any) {
    const data = await this.invitationService.publish(id, req.user.id);
    return successResponse(data, 'Invitation published');
  }

  @Get(':id/stats')
  async stats(@Param('id') id: string, @Req() req: any) {
    const data = await this.invitationService.getStats(id, req.user.id);
    return successResponse(data);
  }
}
