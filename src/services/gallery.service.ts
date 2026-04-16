import { Injectable, NotFoundException } from '@nestjs/common';
import { GalleryRepository } from '../repositories/gallery.repository';
import { InvitationRepository } from '../repositories/invitation.repository';

@Injectable()
export class GalleryService {
    constructor(
        private readonly galleryRepo: GalleryRepository,
        private readonly invitationRepo: InvitationRepository
    ) {}

    async findAll(invitationId: string, userId: string) {
        const invitation = await this.invitationRepo.findByIdAndUser(invitationId, userId);
        if (!invitation) throw new NotFoundException('Invitation not found');
        return this.galleryRepo.findAllByInvitation(invitationId);
    }

    async upload(invitationId: string, userId: string, file: Express.Multer.File, caption?: string) {
        const invitation = await this.invitationRepo.findByIdAndUser(invitationId, userId);
        if (!invitation) throw new NotFoundException('Invitation not found');

        const existing = await this.galleryRepo.findAllByInvitation(invitationId);

        return this.galleryRepo.create({
            invitation: { id: invitationId } as any,
            photo_url: `/uploads/${file.filename}`,
            caption,
            order_index: existing.length
        });
    }

    async delete(id: string, userId: string) {
        const gallery = await this.galleryRepo.findById(id);
        if (!gallery) throw new NotFoundException('Photo not found');

        const invitation = await this.invitationRepo.findByIdAndUser(gallery.invitation.id, userId);
        if (!invitation) throw new NotFoundException('Invitation not found');

        await this.galleryRepo.delete(id);
    }
}
