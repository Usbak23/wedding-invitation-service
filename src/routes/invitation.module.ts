import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from '../models/invitation.model';
import { Guest } from '../models/guest.model';
import { Rsvp } from '../models/rsvp.model';
import { Analytic } from '../models/analytic.model';
import { InvitationRepository } from '../repositories/invitation.repository';
import { GuestRepository } from '../repositories/guest.repository';
import { RsvpRepository } from '../repositories/rsvp.repository';
import { AnalyticRepository } from '../repositories/analytic.repository';
import { InvitationService } from '../services/invitation.service';
import { GuestService } from '../services/guest.service';
import { RsvpService } from '../services/rsvp.service';
import { PublicService } from '../services/public.service';
import { InvitationController } from '../controllers/invitation.controller';
import { GuestController } from '../controllers/guest.controller';
import { RsvpController } from '../controllers/rsvp.controller';
import { PublicController } from '../controllers/public.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation, Guest, Rsvp, Analytic])],
  controllers: [InvitationController, GuestController, RsvpController, PublicController],
  providers: [
    InvitationService, GuestService, RsvpService, PublicService,
    InvitationRepository, GuestRepository, RsvpRepository, AnalyticRepository,
  ],
})
export class InvitationModule {}
