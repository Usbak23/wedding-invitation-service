import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rsvp } from '../models/rsvp.model';
import { getPaginationOptions, PaginationQuery } from '../utils/pagination.util';

@Injectable()
export class RsvpRepository {
  constructor(
    @InjectRepository(Rsvp)
    private readonly repo: Repository<Rsvp>,
  ) {}

  async findAllByInvitation(invitationId: string, pagination: PaginationQuery) {
    const { skip, limit } = getPaginationOptions(pagination);
    const [data, total] = await this.repo.findAndCount({
      where: { invitation: { id: invitationId } },
      relations: ['guest'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });
    return { data, total };
  }

  findByGuest(guestId: string) {
    return this.repo.findOne({ where: { guest: { id: guestId } } });
  }

  create(data: Partial<Rsvp>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<Rsvp>) {
    return this.repo.update(id, data);
  }

  countByInvitationAndStatus(invitationId: string, status: string) {
    return this.repo.count({
      where: { invitation: { id: invitationId }, status: status as any },
    });
  }

  countByInvitation(invitationId: string) {
    return this.repo.count({ where: { invitation: { id: invitationId } } });
  }
}
