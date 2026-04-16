import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RsvpRepository } from '../repositories/rsvp.repository';
import { GuestRepository } from '../repositories/guest.repository';
import { CreateRsvpDto } from '../validators/rsvp.dto';
import { PaginationDto } from '../validators/pagination.dto';
import { paginate } from '../utils/pagination.util';

@Injectable()
export class RsvpService {
    constructor(
        private readonly rsvpRepo: RsvpRepository,
        private readonly guestRepo: GuestRepository
    ) {}

    async submit(dto: CreateRsvpDto) {
        const guest = await this.guestRepo.findById(dto.guest_id);
        if (!guest) throw new NotFoundException('Guest not found');

        const existing = await this.rsvpRepo.findByGuest(dto.guest_id);
        if (existing) {
            await this.rsvpRepo.update(existing.id, {
                status: dto.status,
                total_persons: dto.total_persons ?? 1,
                message: dto.message
            });
            return this.rsvpRepo.findByGuest(dto.guest_id);
        }

        return this.rsvpRepo.create({
            guest: { id: dto.guest_id } as any,
            invitation: { id: dto.invitation_id } as any,
            status: dto.status,
            total_persons: dto.total_persons ?? 1,
            message: dto.message
        });
    }

    async findAll(invitationId: string, pagination: PaginationDto) {
        const { data, total } = await this.rsvpRepo.findAllByInvitation(invitationId, pagination);
        return {
            data,
            meta: paginate(total, pagination.page || 1, pagination.limit || 10)
        };
    }
}
