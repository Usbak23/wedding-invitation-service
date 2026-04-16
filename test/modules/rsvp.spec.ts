import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RsvpService } from '../../src/services/rsvp.service';
import { RsvpRepository } from '../../src/repositories/rsvp.repository';
import { GuestRepository } from '../../src/repositories/guest.repository';
import { mockGuest, mockRsvp } from '../configs/constant';

const mockRsvpRepo = {
    findAllByInvitation: jest.fn(),
    findByGuest: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
};

const mockGuestRepo = { findById: jest.fn() };

describe('RsvpService', () => {
    let service: RsvpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RsvpService, { provide: RsvpRepository, useValue: mockRsvpRepo }, { provide: GuestRepository, useValue: mockGuestRepo }]
        }).compile();

        service = module.get<RsvpService>(RsvpService);
        jest.clearAllMocks();
    });

    describe('submit', () => {
        it('should create new rsvp', async () => {
            mockGuestRepo.findById.mockResolvedValue(mockGuest);
            mockRsvpRepo.findByGuest.mockResolvedValue(null);
            mockRsvpRepo.create.mockResolvedValue(mockRsvp);

            const result = await service.submit({
                guest_id: 'guest-uuid-1',
                invitation_id: 'inv-uuid-1',
                status: 'hadir',
                total_persons: 2,
                message: 'Insya Allah hadir!'
            });
            expect(result.status).toBe('hadir');
        });

        it('should update existing rsvp', async () => {
            mockGuestRepo.findById.mockResolvedValue(mockGuest);
            mockRsvpRepo.findByGuest.mockResolvedValueOnce({ ...mockRsvp, status: 'mungkin' }).mockResolvedValueOnce({ ...mockRsvp, status: 'hadir' });
            mockRsvpRepo.update.mockResolvedValue(undefined);

            await service.submit({
                guest_id: 'guest-uuid-1',
                invitation_id: 'inv-uuid-1',
                status: 'hadir'
            });
            expect(mockRsvpRepo.update).toHaveBeenCalled();
        });

        it('should throw NotFoundException if guest not found', async () => {
            mockGuestRepo.findById.mockResolvedValue(null);
            await expect(
                service.submit({
                    guest_id: 'guest-uuid-1',
                    invitation_id: 'inv-uuid-1',
                    status: 'hadir'
                })
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return paginated rsvps', async () => {
            mockRsvpRepo.findAllByInvitation.mockResolvedValue({
                data: [mockRsvp],
                total: 1
            });
            const result = await service.findAll('inv-uuid-1', {
                page: 1,
                limit: 10
            });
            expect(result.meta.total).toBe(1);
        });
    });
});
