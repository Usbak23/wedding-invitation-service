import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RsvpService } from '../services/rsvp.service';
import { CreateRsvpDto } from '../validators/rsvp.dto';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { successResponse } from '../helpers/response.helper';

@Controller('api/rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @Post()
  async submit(@Body() dto: CreateRsvpDto) {
    const data = await this.rsvpService.submit(dto);
    return successResponse(data, 'RSVP submitted');
  }

  @Get('invitation/:invitationId')
  @UseGuards(JwtAuthGuard)
  async findAll(@Param('invitationId') invitationId: string) {
    const data = await this.rsvpService.findAll(invitationId);
    return successResponse(data);
  }
}
