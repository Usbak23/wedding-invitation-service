import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PublicService } from '../../src/services/public.service';
import { InvitationRepository } from '../../src/repositories/invitation.repository';
import { GuestRepository } from '../../src/repositories/guest.repository';
import { AnalyticRepository } from '../../src/repositories/analytic.repository';
import { mockInvitation, mockGuest, mockReq } from '../configs/constant';

const mockInvitationRepo = { findBySlug: jest.fn() };
const mockGuestRepo = { findByCode: jest.fn() };
const mockAnalyticRepo = { create: jest.fn() };

describe('PublicService', () => {
    let service: PublicService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PublicService,
                { provide: InvitationRepository, useValue: mockInvitationRepo },
                { provide: GuestRepository, useValue: mockGuestRepo },
                { provide: AnalyticRepository, useValue: mockAnalyticRepo }
            ]
        }).compile();

        service = module.get<PublicService>(PublicService);
        jest.clearAllMocks();
    });

    describe('getBySlug', () => {
        it('should return invitation and track view', async () => {
            const published = { ...mockInvitation, status: 'published' };
            mockInvitationRepo.findBySlug.mockResolvedValue(published);
            mockAnalyticRepo.create.mockResolvedValue(undefined);

            const result = await service.getBySlug('ahmad-siti-abc12', mockReq);
            expect(result.slug).toBe('ahmad-siti-abc12');
            expect(mockAnalyticRepo.create).toHaveBeenCalledWith(expect.objectContaining({ event: 'view' }));
        });

        it('should throw NotFoundException if not found', async () => {
            mockInvitationRepo.findBySlug.mockResolvedValue(null);
            await expect(service.getBySlug('not-found', mockReq)).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if draft', async () => {
            mockInvitationRepo.findBySlug.mockResolvedValue({
                ...mockInvitation,
                status: 'draft'
            });
            await expect(service.getBySlug('ahmad-siti-abc12', mockReq)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getGuestByCode', () => {
        it('should return invitation and guest', async () => {
            mockInvitationRepo.findBySlug.mockResolvedValue({
                ...mockInvitation,
                status: 'published'
            });
            mockGuestRepo.findByCode.mockResolvedValue(mockGuest);

            const result = await service.getGuestByCode('ahmad-siti-abc12', 'ABCD1234');
            expect(result.guest.name).toBe('Budi Santoso');
        });

        it('should throw NotFoundException if guest not found', async () => {
            mockInvitationRepo.findBySlug.mockResolvedValue({
                ...mockInvitation,
                status: 'published'
            });
            mockGuestRepo.findByCode.mockResolvedValue(null);
            await expect(service.getGuestByCode('ahmad-siti-abc12', 'WRONG')).rejects.toThrow(NotFoundException);
        });
    });
});
