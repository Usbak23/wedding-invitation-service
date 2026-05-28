import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { BankAccountService } from '../../src/services/bank-account.service';
import { BankAccountRepository } from '../../src/repositories/bank-account.repository';
import { InvitationRepository } from '../../src/repositories/invitation.repository';
import { mockInvitation } from '../configs/constant';

const mockBankAccount = {
    id: 'ba-uuid-1',
    bank_name: 'BCA',
    account_name: 'Ahmad',
    account_number: '1234567890',
    logo_url: null,
    order_index: 0,
    invitation: { id: 'inv-uuid-1' },
    created_at: new Date('2026-01-01')
};

const mockBankAccountRepo = {
    findByInvitation: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn()
};

const mockInvitationRepo = { findByIdAndUser: jest.fn() };

describe('BankAccountService', () => {
    let service: BankAccountService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BankAccountService,
                { provide: BankAccountRepository, useValue: mockBankAccountRepo },
                { provide: InvitationRepository, useValue: mockInvitationRepo }
            ]
        }).compile();

        service = module.get<BankAccountService>(BankAccountService);
        jest.clearAllMocks();
    });

    describe('getByInvitation', () => {
        it('should return bank accounts', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockBankAccountRepo.findByInvitation.mockResolvedValue([mockBankAccount]);

            const result = await service.getByInvitation('inv-uuid-1', 'user-uuid-1');
            expect(result).toHaveLength(1);
            expect(result[0].bank_name).toBe('BCA');
        });

        it('should throw NotFoundException if invitation not found', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.getByInvitation('inv-uuid-1', 'user-uuid-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create bank account', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockBankAccountRepo.create.mockResolvedValue(mockBankAccount);

            const result = await service.create('inv-uuid-1', { bank_name: 'BCA', account_name: 'Ahmad', account_number: '1234567890' }, 'user-uuid-1');
            expect(result.bank_name).toBe('BCA');
        });

        it('should throw NotFoundException if invitation not found', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.create('inv-uuid-1', { bank_name: 'BCA', account_name: 'Ahmad', account_number: '123' }, 'user-uuid-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete bank account', async () => {
            mockBankAccountRepo.findById.mockResolvedValue(mockBankAccount);
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockBankAccountRepo.delete.mockResolvedValue(undefined);

            await expect(service.delete('ba-uuid-1', 'user-uuid-1')).resolves.not.toThrow();
        });

        it('should throw NotFoundException if bank account not found', async () => {
            mockBankAccountRepo.findById.mockResolvedValue(null);
            await expect(service.delete('ba-uuid-1', 'user-uuid-1')).rejects.toThrow(NotFoundException);
        });

        it('should throw ForbiddenException if not owner', async () => {
            mockBankAccountRepo.findById.mockResolvedValue(mockBankAccount);
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.delete('ba-uuid-1', 'other-user')).rejects.toThrow(ForbiddenException);
        });
    });
});
