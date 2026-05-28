import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from '../models/invitation.model';
import { Guest } from '../models/guest.model';
import { Rsvp } from '../models/rsvp.model';
import { Analytic } from '../models/analytic.model';
import { BankAccount } from '../models/bank-account.model';
import { InvitationRepository } from '../repositories/invitation.repository';
import { GuestRepository } from '../repositories/guest.repository';
import { RsvpRepository } from '../repositories/rsvp.repository';
import { AnalyticRepository } from '../repositories/analytic.repository';
import { BankAccountRepository } from '../repositories/bank-account.repository';
import { InvitationService } from '../services/invitation.service';
import { GuestService } from '../services/guest.service';
import { RsvpService } from '../services/rsvp.service';
import { PublicService } from '../services/public.service';
import { BankAccountService } from '../services/bank-account.service';
import { InvitationController } from '../controllers/invitation.controller';
import { GuestController } from '../controllers/guest.controller';
import { RsvpController } from '../controllers/rsvp.controller';
import { PublicController } from '../controllers/public.controller';
import { BankAccountController } from '../controllers/bank-account.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Invitation, Guest, Rsvp, Analytic, BankAccount])],
    controllers: [InvitationController, GuestController, RsvpController, PublicController, BankAccountController],
    providers: [
        InvitationService, GuestService, RsvpService, PublicService, BankAccountService,
        InvitationRepository, GuestRepository, RsvpRepository, AnalyticRepository, BankAccountRepository,
    ],
})
export class InvitationModule {}
