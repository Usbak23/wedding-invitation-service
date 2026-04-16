import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GalleryService } from '../../src/services/gallery.service';
import { GalleryRepository } from '../../src/repositories/gallery.repository';
import { InvitationRepository } from '../../src/repositories/invitation.repository';
import { mockInvitation } from '../configs/constant';

const mockGalleryRepo = {
    findAllByInvitation: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn()
};

const mockInvitationRepo = { findByIdAndUser: jest.fn() };

const mockGallery = {
    id: 'gallery-uuid-1',
    photo_url: '/uploads/photo.jpg',
    caption: 'Foto pernikahan',
    order_index: 0,
    invitation: { id: 'inv-uuid-1' },
    created_at: new Date('2026-01-01')
};

const mockFile = { filename: 'photo.jpg' } as Express.Multer.File;

describe('GalleryService', () => {
    let service: GalleryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GalleryService, { provide: GalleryRepository, useValue: mockGalleryRepo }, { provide: InvitationRepository, useValue: mockInvitationRepo }]
        }).compile();

        service = module.get<GalleryService>(GalleryService);
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return gallery list', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockGalleryRepo.findAllByInvitation.mockResolvedValue([mockGallery]);

            const result = await service.findAll('inv-uuid-1', 'user-uuid-1');
            expect(result).toHaveLength(1);
        });

        it('should throw NotFoundException if invitation not found', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.findAll('inv-uuid-1', 'user-uuid-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('upload', () => {
        it('should upload photo with correct order_index', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockGalleryRepo.findAllByInvitation.mockResolvedValue([mockGallery]);
            mockGalleryRepo.create.mockResolvedValue({ ...mockGallery, order_index: 1 });

            const result = await service.upload('inv-uuid-1', 'user-uuid-1', mockFile, 'caption');
            expect(mockGalleryRepo.create).toHaveBeenCalledWith(expect.objectContaining({ photo_url: '/uploads/photo.jpg', order_index: 1 }));
            expect(result.order_index).toBe(1);
        });

        it('should throw NotFoundException if invitation not found', async () => {
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.upload('inv-uuid-1', 'user-uuid-1', mockFile)).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete gallery item', async () => {
            mockGalleryRepo.findById.mockResolvedValue(mockGallery);
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(mockInvitation);
            mockGalleryRepo.delete.mockResolvedValue(undefined);

            await expect(service.delete('gallery-uuid-1', 'user-uuid-1')).resolves.not.toThrow();
        });

        it('should throw NotFoundException if photo not found', async () => {
            mockGalleryRepo.findById.mockResolvedValue(null);
            await expect(service.delete('gallery-uuid-1', 'user-uuid-1')).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if invitation not owned by user', async () => {
            mockGalleryRepo.findById.mockResolvedValue(mockGallery);
            mockInvitationRepo.findByIdAndUser.mockResolvedValue(null);
            await expect(service.delete('gallery-uuid-1', 'user-uuid-1')).rejects.toThrow(NotFoundException);
        });
    });
});
