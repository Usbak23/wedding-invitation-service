import { Injectable } from '@nestjs/common';
import { AdminUserRepository } from '../repositories/admin-user.repository';
import { AdminInvitationRepository } from '../repositories/admin-invitation.repository';

@Injectable()
export class AdminService {
    constructor(
        private readonly userRepo: AdminUserRepository,
        private readonly invitationRepo: AdminInvitationRepository
    ) {}

    getUsers() {
        return this.userRepo.findAll();
    }

    deleteUser(id: string) {
        return this.userRepo.delete(id);
    }

    getInvitations() {
        return this.invitationRepo.findAll();
    }

    async getDashboard() {
        const [totalUsers, totalInvitations, published, draft] = await Promise.all([
            this.userRepo.count(),
            this.invitationRepo.count(),
            this.invitationRepo.countByStatus('published'),
            this.invitationRepo.countByStatus('draft')
        ]);
        return { totalUsers, totalInvitations, published, draft };
    }
}
