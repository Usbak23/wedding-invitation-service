import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { CreateAnalyticDto } from '../validators/analytic.dto';
import { successResponse } from '../helpers/response.helper';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track/:invitationId')
  async track(
    @Param('invitationId') invitationId: string,
    @Body() dto: CreateAnalyticDto,
    @Req() req: any,
  ) {
    await this.analyticsService.track(invitationId, dto.event, req);
    return successResponse(null, 'Event tracked');
  }

  @Get('summary/:invitationId')
  @UseGuards(JwtAuthGuard)
  async summary(@Param('invitationId') invitationId: string) {
    const data = await this.analyticsService.getSummary(invitationId);
    return successResponse(data);
  }
}
