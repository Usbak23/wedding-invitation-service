import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InvitationService } from '../../src/services/invitation.service';
import { InvitationRepository } from '../../src/repositories/invitation.repository';
import { GuestRepository } from '../../src/repositories/guest.repository';
import { RsvpRepository } from '../../src/repositories/rsvp.repository';
import { mockInvitation } from '../configs/constant';

const mockInvitationRepo = {
    findAllByUser: jest.fn(),
    findById: jest.fn(),
    findByIdAndUser: jest.fn(),
    slugExists: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

const mockGuestRepo = { countByInvitation: jest.fn() };
const mockRsvpRepo = {
    countByInvitation: jest.fn(),
    countByInvitationAndStatus: jest.fn()
};

describe('InvitationService', () => {
    let service: InvitationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvitationService,
                { provide: InvitationRepository, useValue: mockInvitationRepo },
                { provide: GuestRepository, useValue: mockGuestRepo },
                { provide: RsvpRepository, useValue: mockRsvpRepo }
            ]
        }).compile();

        service = module.get<InvitationService>(InvitationService);
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return paginated invitations', async () => {
            mockInvitationRepo.findAllByUser.mockResolvedValue({
                data: [mockInvitation],
                total: 1
            });

            const result = await service.findAll('user-uuid-1', { page: 1, limit: 10 });
            expect(result.meta.total).toBe(1);
            expect(result.data).toHaveLength(1);
        });
    });

    describe('findOne', () => {
        it('should return invitation', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            const result = await service.findOne('inv-uuid-1', 'user-uuid-1');
            expect(result.id).toBe('inv-uuid-1');
        });

        it('should throw NotFoundException', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.findOne('inv-uuid-1', 'user-uuid-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create invitation', async () => {
            mockInvitationRepo.create.mockResolvedValue(mockInvitation);
            const result = await service.create({ groom_name: 'Ahmad', bride_name: 'Siti' }, 'user-uuid-1');
            expect(result).toHaveProperty('id');
        });
    });

    describe('update', () => {
        it('should update and return invitation', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockInvitationRepo.update.mockResolvedValue(undefined);
            mockInvitationRepo.findById.mockResolvedValue({
                ...mockInvitation,
                groom_name: 'Ahmad Updated'
            });

            const result = await service.update('inv-uuid-1', { groom_name: 'Ahmad Updated' }, 'user-uuid-1');
            expect(result.groom_name).toBe('Ahmad Updated');
        });

        it('should throw NotFoundException if invitation not found', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.update('inv-uuid-1', { groom_name: 'X' }, 'user-uuid-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete invitation', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockInvitationRepo.delete.mockResolvedValue(undefined);
            await expect(service.delete('inv-uuid-1', 'user-uuid-1')).resolves.not.toThrow();
        });

        it('should throw NotFoundException', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.delete('inv-uuid-1', 'user-uuid-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('publish', () => {
        it('should publish and generate slug', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockInvitationRepo.slugExists.mockResolvedValue(false);
            mockInvitationRepo.update.mockResolvedValue(undefined);
            mockInvitationRepo.findById.mockResolvedValue({
                ...mockInvitation,
                status: 'published'
            });

            const result = await service.publish('inv-uuid-1', 'user-uuid-1');
            expect(result.status).toBe('published');
        });

        it('should throw NotFoundException', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.publish('inv-uuid-1', 'user-uuid-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getStats', () => {
        it('should return stats using parallel queries', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockGuestRepo.countByInvitation.mockResolvedValue(10);
            mockRsvpRepo.countByInvitation.mockResolvedValue(7);
            mockRsvpRepo.countByInvitationAndStatus.mockResolvedValueOnce(5).mockResolvedValueOnce(1).mockResolvedValueOnce(1);

            const result = await service.getStats('inv-uuid-1', 'user-uuid-1');
            expect(result).toEqual({
                total_guests: 10,
                total_rsvp: 7,
                belum_rsvp: 3,
                hadir: 5,
                tidak: 1,
                mungkin: 1
            });
        });
    });
});
