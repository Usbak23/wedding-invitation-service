import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BankAccountRepository } from '../repositories/bank-account.repository';
import { InvitationRepository } from '../repositories/invitation.repository';
import { CreateBankAccountDto } from '../validators/bank-account.dto';

@Injectable()
export class BankAccountService {
    constructor(
        private readonly bankAccountRepo: BankAccountRepository,
        private readonly invitationRepo: InvitationRepository
    ) {}

    async getByInvitation(invitationId: string, userId: string) {
        const invitation = await this.invitationRepo.findByIdAndUser(invitationId, userId);
        if (!invitation) throw new NotFoundException('Invitation not found');
        return this.bankAccountRepo.findByInvitation(invitationId);
    }

    async create(invitationId: string, dto: CreateBankAccountDto, userId: string) {
        const invitation = await this.invitationRepo.findByIdAndUser(invitationId, userId);
        if (!invitation) throw new NotFoundException('Invitation not found');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return this.bankAccountRepo.create({ ...dto, invitation: { id: invitationId } as any });
    }

    async delete(id: string, userId: string) {
        const account = await this.bankAccountRepo.findById(id);
        if (!account) throw new NotFoundException('Bank account not found');
        const invitation = await this.invitationRepo.findByIdAndUser(account.invitation.id, userId);
        if (!invitation) throw new ForbiddenException();
        await this.bankAccountRepo.delete(id);
    }
}
