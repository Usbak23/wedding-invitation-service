import { Injectable, NotFoundException } from '@nestjs/common';
import { GuestRepository } from '../repositories/guest.repository';
import { InvitationRepository } from '../repositories/invitation.repository';
import { CreateGuestDto, BulkCreateGuestDto } from '../validators/guest.dto';
import { generateGuestCode } from '../helpers/slug.helper';

@Injectable()
export class GuestService {
  constructor(
    private readonly guestRepo: GuestRepository,
    private readonly invitationRepo: InvitationRepository,
  ) {}

  async findAll(invitationId: string, userId: string) {
    const invitation = await this.invitationRepo.findByIdAndUser(invitationId, userId);
    if (!invitation) throw new NotFoundException('Invitation not found');
    return this.guestRepo.findAllByInvitation(invitationId);
  }

  async create(invitationId: string, dto: CreateGuestDto, userId: string) {
    const invitation = await this.invitationRepo.findByIdAndUser(invitationId, userId);
    if (!invitation) throw new NotFoundException('Invitation not found');
    return this.guestRepo.create({
      ...dto,
      code: generateGuestCode(),
      invitation: { id: invitationId } as any,
    });
  }

  async bulkCreate(invitationId: string, dto: BulkCreateGuestDto, userId: string) {
    const invitation = await this.invitationRepo.findByIdAndUser(invitationId, userId);
    if (!invitation) throw new NotFoundException('Invitation not found');
    const guests = dto.guests.map((g) => ({
      ...g,
      code: generateGuestCode(),
      invitation: { id: invitationId } as any,
    }));
    return this.guestRepo.bulkCreate(guests);
  }

  async update(id: string, dto: CreateGuestDto) {
    const guest = await this.guestRepo.findById(id);
    if (!guest) throw new NotFoundException('Guest not found');
    await this.guestRepo.update(id, dto);
    return this.guestRepo.findById(id);
  }

  async delete(id: string) {
    const guest = await this.guestRepo.findById(id);
    if (!guest) throw new NotFoundException('Guest not found');
    await this.guestRepo.delete(id);
  }
}
