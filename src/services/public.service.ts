import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { InvitationRepository } from '../repositories/invitation.repository';
import { GuestRepository } from '../repositories/guest.repository';
import { AnalyticRepository } from '../repositories/analytic.repository';

@Injectable()
export class PublicService {
  constructor(
    private readonly invitationRepo: InvitationRepository,
    private readonly guestRepo: GuestRepository,
    private readonly analyticRepo: AnalyticRepository,
  ) {}

  async getBySlug(slug: string, req: Request) {
    const invitation = await this.invitationRepo.findBySlug(slug);
    if (!invitation || invitation.status !== 'published') {
      throw new NotFoundException('Invitation not found');
    }
    await this.analyticRepo.create({
      invitation: { id: invitation.id } as any,
      event: 'view',
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
    });
    return invitation;
  }

  async getGuestByCode(slug: string, code: string) {
    const invitation = await this.invitationRepo.findBySlug(slug);
    if (!invitation || invitation.status !== 'published') {
      throw new NotFoundException('Invitation not found');
    }
    const guest = await this.guestRepo.findByCode(code);
    if (!guest || guest.invitation.id !== invitation.id) {
      throw new NotFoundException('Guest not found');
    }
    return { invitation, guest };
  }
}
