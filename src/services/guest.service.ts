import { Injectable, NotFoundException } from '@nestjs/common';
import { GuestRepository } from '../repositories/guest.repository';
import { InvitationRepository } from '../repositories/invitation.repository';
import { CreateGuestDto, BulkCreateGuestDto } from '../validators/guest.dto';
import { PaginationDto } from '../validators/pagination.dto';
import { paginate } from '../utils/pagination.util';
import { generateGuestCode } from '../helpers/slug.helper';

@Injectable()
export class GuestService {
  constructor(
    private readonly guestRepo: GuestRepository,
    private readonly invitationRepo: InvitationRepository,
  ) {}

  async findAll(invitationId: string, userId: string, pagination: PaginationDto) {
    const invitation = await this.invitationRepo.findByIdAndUser(invitationId, userId);
    if (!invitation) throw new NotFoundException('Invitation not found');
    const { data, total } = await this.guestRepo.findAllByInvitation(invitationId, pagination);
    return { data, meta: paginate(total, pagination.page || 1, pagination.limit || 10) };
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
    const codes = new Set<string>();
    const guests = dto.guests.map((g) => {
      let code = generateGuestCode();
      while (codes.has(code)) code = generateGuestCode();
      codes.add(code);
      return { ...g, code, invitation: { id: invitationId } as any };
    });
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
