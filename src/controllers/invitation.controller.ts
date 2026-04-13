import {
  Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationService } from '../services/invitation.service';
import { CreateInvitationDto, UpdateInvitationDto } from '../validators/invitation.dto';
import { PaginationDto } from '../validators/pagination.dto';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { ParseUuidPipe } from '../middlewares/parse-uuid.pipe';
import { successResponse } from '../helpers/response.helper';

@ApiTags('Invitations')
@ApiBearerAuth('access-token')
@Controller('api/invitations')
@UseGuards(JwtAuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get()
  @ApiOperation({ summary: 'List semua undangan milik user' })
  async findAll(@Query() pagination: PaginationDto, @Req() req: any) {
    const data = await this.invitationService.findAll(req.user.id, pagination);
    return successResponse(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail undangan' })
  async findOne(@Param('id', ParseUuidPipe) id: string, @Req() req: any) {
    const data = await this.invitationService.findOne(id, req.user.id);
    return successResponse(data);
  }

  @Post()
  @ApiOperation({ summary: 'Buat undangan baru' })
  async create(@Body() dto: CreateInvitationDto, @Req() req: any) {
    const data = await this.invitationService.create(dto, req.user.id);
    return successResponse(data, 'Invitation created');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update undangan' })
  async update(@Param('id', ParseUuidPipe) id: string, @Body() dto: UpdateInvitationDto, @Req() req: any) {
    const data = await this.invitationService.update(id, dto, req.user.id);
    return successResponse(data, 'Invitation updated');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partial update undangan' })
  async patch(@Param('id', ParseUuidPipe) id: string, @Body() dto: UpdateInvitationDto, @Req() req: any) {
    const data = await this.invitationService.update(id, dto, req.user.id);
    return successResponse(data, 'Invitation updated');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus undangan' })
  async delete(@Param('id', ParseUuidPipe) id: string, @Req() req: any) {
    await this.invitationService.delete(id, req.user.id);
    return successResponse(null, 'Invitation deleted');
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish undangan dan generate slug unik' })
  async publish(@Param('id', ParseUuidPipe) id: string, @Req() req: any) {
    const data = await this.invitationService.publish(id, req.user.id);
    return successResponse(data, 'Invitation published');
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Statistik RSVP undangan' })
  async stats(@Param('id', ParseUuidPipe) id: string, @Req() req: any) {
    const data = await this.invitationService.getStats(id, req.user.id);
    return successResponse(data);
  }
}
