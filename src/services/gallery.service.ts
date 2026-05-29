import { Injectable, NotFoundException } from '@nestjs/common';
import { GalleryRepository } from '../repositories/gallery.repository';
import { InvitationRepository } from '../repositories/invitation.repository';
import { deleteFile, getFileUrl } from '../integrations/storage.integration';

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
        const fileKey = (file as unknown as { key: string }).key;

        return this.galleryRepo.create({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            invitation: { id: invitationId } as any,
            photo_url: getFileUrl(fileKey),
            caption,
            order_index: existing.length
        });
    }

    async delete(id: string, userId: string) {
        const gallery = await this.galleryRepo.findById(id);
        if (!gallery) throw new NotFoundException('Photo not found');

        const invitation = await this.invitationRepo.findByIdAndUser(gallery.invitation.id, userId);
        if (!invitation) throw new NotFoundException('Invitation not found');

        // Extract key from URL
        const url = gallery.photo_url;
        const key = url.split('/').slice(-2).join('/');
        await deleteFile(key).catch(() => {});
        await this.galleryRepo.delete(id);
    }
}
