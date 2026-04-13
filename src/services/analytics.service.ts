import { Injectable } from '@nestjs/common';
import { AnalyticRepository } from '../repositories/analytic.repository';
import { Request } from 'express';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticRepo: AnalyticRepository) {}

  track(invitationId: string, event: string, req: Request) {
    return this.analyticRepo.create({
      invitation: { id: invitationId } as any,
      event,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
    });
  }

  async getSummary(invitationId: string) {
    const [views, rsvp_opens, shares] = await Promise.all([
      this.analyticRepo.countByEvent(invitationId, 'view'),
      this.analyticRepo.countByEvent(invitationId, 'rsvp_open'),
      this.analyticRepo.countByEvent(invitationId, 'share'),
    ]);
    return { views, rsvp_opens, shares };
  }
}
