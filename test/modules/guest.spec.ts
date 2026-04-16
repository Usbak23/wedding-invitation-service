import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GuestService } from '../../src/services/guest.service';
import { GuestRepository } from '../../src/repositories/guest.repository';
import { InvitationRepository } from '../../src/repositories/invitation.repository';
import { mockInvitation, mockGuest } from '../configs/constant';

const mockGuestRepo = {
    findAllByInvitation: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    bulkCreate: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

const mockInvitationRepo = { findByIdAndUser: jest.fn() };

describe('GuestService', () => {
    let service: GuestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GuestService, { provide: GuestRepository, useValue: mockGuestRepo }, { provide: InvitationRepository, useValue: mockInvitationRepo }]
        }).compile();

        service = module.get<GuestService>(GuestService);
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return paginated guests', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockGuestRepo.findAllByInvitation.mockResolvedValue({
                data: [mockGuest],
                total: 1
            });

            const result = await service.findAll('inv-uuid-1', 'user-uuid-1', {
                page: 1,
                limit: 10
            });
            expect(result.meta.total).toBe(1);
            expect(result.data).toHaveLength(1);
        });

        it('should throw NotFoundException if invitation not found', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.findAll('inv-uuid-1', 'user-uuid-1', { page: 1, limit: 10 })).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create guest with code', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockGuestRepo.create.mockResolvedValue(mockGuest);

            const result = await service.create('inv-uuid-1', { name: 'Budi' }, 'user-uuid-1');
            expect(result).toHaveProperty('code');
        });
    });

    describe('bulkCreate', () => {
        it('should create multiple guests with unique codes', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockGuestRepo.bulkCreate.mockResolvedValue([mockGuest, { ...mockGuest, id: 'guest-uuid-2', code: 'XYZ9876' }]);

            const result = await service.bulkCreate('inv-uuid-1', { guests: [{ name: 'Tamu 1' }, { name: 'Tamu 2' }] }, 'user-uuid-1');
            expect(result).toHaveLength(2);
        });
    });

    describe('update', () => {
        it('should update and return guest', async () => {
            mockGuestRepo.findById.mockResolvedValueOnce(mockGuest).mockResolvedValueOnce({ ...mockGuest, name: 'Budi Updated' });
            mockGuestRepo.update.mockResolvedValue(undefined);

            const result = await service.update('guest-uuid-1', { name: 'Budi Updated' });
            expect(result.name).toBe('Budi Updated');
        });

        it('should throw NotFoundException if guest not found', async () => {
            mockGuestRepo.findById.mockResolvedValue(null);
            await expect(service.update('guest-uuid-1', { name: 'X' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete guest', async () => {
            mockGuestRepo.findById.mockResolvedValue(mockGuest);
            mockGuestRepo.delete.mockResolvedValue(undefined);
            await expect(service.delete('guest-uuid-1')).resolves.not.toThrow();
        });

        it('should throw NotFoundException', async () => {
            mockGuestRepo.findById.mockResolvedValue(null);
            await expect(service.delete('guest-uuid-1')).rejects.toThrow(NotFoundException);
        });
    });
});
