import {
  Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GuestService } from '../services/guest.service';
import { CreateGuestDto, BulkCreateGuestDto } from '../validators/guest.dto';
import { PaginationDto } from '../validators/pagination.dto';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { ParseUuidPipe } from '../middlewares/parse-uuid.pipe';
import { successResponse } from '../helpers/response.helper';

@ApiTags('Guests')
@ApiBearerAuth('access-token')
@Controller('api/invitations/:invitationId/guests')
@UseGuards(JwtAuthGuard)
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Get()
  @ApiOperation({ summary: 'List semua tamu undangan' })
  async findAll(
    @Param('invitationId', ParseUuidPipe) invitationId: string,
    @Query() pagination: PaginationDto,
    @Req() req: any,
  ) {
    const data = await this.guestService.findAll(invitationId, req.user.id, pagination);
    return successResponse(data);
  }

  @Post()
  @ApiOperation({ summary: 'Tambah tamu baru' })
  async create(
    @Param('invitationId', ParseUuidPipe) invitationId: string,
    @Body() dto: CreateGuestDto,
    @Req() req: any,
  ) {
    const data = await this.guestService.create(invitationId, dto, req.user.id);
    return successResponse(data, 'Guest added');
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Tambah banyak tamu sekaligus' })
  async bulkCreate(
    @Param('invitationId', ParseUuidPipe) invitationId: string,
    @Body() dto: BulkCreateGuestDto,
    @Req() req: any,
  ) {
    const data = await this.guestService.bulkCreate(invitationId, dto, req.user.id);
    return successResponse(data, `${data.length} guests added`);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update data tamu' })
  async update(@Param('id', ParseUuidPipe) id: string, @Body() dto: CreateGuestDto) {
    const data = await this.guestService.update(id, dto);
    return successResponse(data, 'Guest updated');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus tamu' })
  async delete(@Param('id', ParseUuidPipe) id: string) {
    await this.guestService.delete(id);
    return successResponse(null, 'Guest deleted');
  }
}
