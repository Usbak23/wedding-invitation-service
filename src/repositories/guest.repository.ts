import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from '../models/guest.model';
import { getPaginationOptions, PaginationQuery } from '../utils/pagination.util';

@Injectable()
export class GuestRepository {
  constructor(
    @InjectRepository(Guest)
    private readonly repo: Repository<Guest>,
  ) {}

  async findAllByInvitation(invitationId: string, pagination: PaginationQuery) {
    const { skip, limit } = getPaginationOptions(pagination);
    const [data, total] = await this.repo.findAndCount({
      where: { invitation: { id: invitationId } },
      relations: ['rsvp'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });
    return { data, total };
  }

  countByInvitation(invitationId: string) {
    return this.repo.count({ where: { invitation: { id: invitationId } } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['rsvp', 'invitation'] });
  }

  findByCode(code: string) {
    return this.repo.findOne({ where: { code }, relations: ['invitation', 'rsvp'] });
  }

  create(data: Partial<Guest>) {
    return this.repo.save(this.repo.create(data));
  }

  bulkCreate(data: Partial<Guest>[]) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<Guest>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
