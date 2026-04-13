import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InvitationRepository } from '../repositories/invitation.repository';
import { GuestRepository } from '../repositories/guest.repository';
import { RsvpRepository } from '../repositories/rsvp.repository';
import { CreateInvitationDto, UpdateInvitationDto } from '../validators/invitation.dto';
import { generateSlug } from '../helpers/slug.helper';

@Injectable()
export class InvitationService {
  constructor(
    private readonly invitationRepo: InvitationRepository,
    private readonly guestRepo: GuestRepository,
    private readonly rsvpRepo: RsvpRepository,
  ) {}

  findAll(userId: string) {
    return this.invitationRepo.findAllByUser(userId);
  }

  async findOne(id: string, userId: string) {
    const invitation = await this.invitationRepo.findByIdAndUser(id, userId);
    if (!invitation) throw new NotFoundException('Invitation not found');
    return invitation;
  }

  create(dto: CreateInvitationDto, userId: string) {
    return this.invitationRepo.create({
      ...dto,
      akad_date: dto.akad_date ? new Date(dto.akad_date) : undefined,
      resepsi_date: dto.resepsi_date ? new Date(dto.resepsi_date) : undefined,
      slug: `draft-${Date.now()}`,
      user: { id: userId } as any,
    });
  }

  async update(id: string, dto: UpdateInvitationDto, userId: string) {
    const invitation = await this.invitationRepo.findByIdAndUser(id, userId);
    if (!invitation) throw new NotFoundException('Invitation not found');
    await this.invitationRepo.update(id, {
      ...dto,
      akad_date: dto.akad_date ? new Date(dto.akad_date) : undefined,
      resepsi_date: dto.resepsi_date ? new Date(dto.resepsi_date) : undefined,
    });
    return this.invitationRepo.findById(id);
  }

  async delete(id: string, userId: string) {
    const invitation = await this.invitationRepo.findByIdAndUser(id, userId);
    if (!invitation) throw new NotFoundException('Invitation not found');
    await this.invitationRepo.delete(id);
  }

  async publish(id: string, userId: string) {
    const invitation = await this.invitationRepo.findByIdAndUser(id, userId);
    if (!invitation) throw new NotFoundException('Invitation not found');

    let slug = generateSlug(invitation.groom_name, invitation.bride_name);
    while (await this.invitationRepo.slugExists(slug)) {
      slug = generateSlug(invitation.groom_name, invitation.bride_name);
    }

    await this.invitationRepo.update(id, { slug, status: 'published' });
    return this.invitationRepo.findById(id);
  }

  async getStats(id: string, userId: string) {
    const invitation = await this.invitationRepo.findByIdAndUser(id, userId);
    if (!invitation) throw new NotFoundException('Invitation not found');

    const guests = await this.guestRepo.findAllByInvitation(id);
    const totalGuests = guests.length;
    const totalRsvp = await this.rsvpRepo.countByInvitation(id);
    const hadir = await this.rsvpRepo.countByInvitationAndStatus(id, 'hadir');
    const tidak = await this.rsvpRepo.countByInvitationAndStatus(id, 'tidak');
    const mungkin = await this.rsvpRepo.countByInvitationAndStatus(id, 'mungkin');

    return {
      total_guests: totalGuests,
      total_rsvp: totalRsvp,
      belum_rsvp: totalGuests - totalRsvp,
      hadir,
      tidak,
      mungkin,
    };
  }
}
