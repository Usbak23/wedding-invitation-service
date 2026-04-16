import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.model';
import { Invitation } from '../models/invitation.model';
import { AdminUserRepository } from '../repositories/admin-user.repository';
import { AdminInvitationRepository } from '../repositories/admin-invitation.repository';
import { AdminService } from '../services/admin.service';
import { AdminController } from '../controllers/admin.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Invitation])],
    controllers: [AdminController],
    providers: [AdminService, AdminUserRepository, AdminInvitationRepository]
})
export class AdminModule {}
