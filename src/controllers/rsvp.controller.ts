import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RsvpService } from '../services/rsvp.service';
import { CreateRsvpDto } from '../validators/rsvp.dto';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { successResponse } from '../helpers/response.helper';

@ApiTags('RSVP')
@Controller('api/rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @Post()
  @ApiOperation({ summary: 'Submit RSVP dari tamu (public)' })
  async submit(@Body() dto: CreateRsvpDto) {
    const data = await this.rsvpService.submit(dto);
    return successResponse(data, 'RSVP submitted');
  }

  @Get('invitation/:invitationId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List semua RSVP per undangan' })
  async findAll(@Param('invitationId') invitationId: string) {
    const data = await this.rsvpService.findAll(invitationId);
    return successResponse(data);
  }
}
