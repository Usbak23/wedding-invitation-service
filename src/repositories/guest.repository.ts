import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from '../models/guest.model';

@Injectable()
export class GuestRepository {
  constructor(
    @InjectRepository(Guest)
    private readonly repo: Repository<Guest>,
  ) {}

  findAllByInvitation(invitationId: string) {
    return this.repo.find({
      where: { invitation: { id: invitationId } },
      relations: ['rsvp'],
      order: { created_at: 'DESC' },
    });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['rsvp', 'invitation'] });
  }

  findByCode(code: string) {
    return this.repo.findOne({ where: { code }, relations: ['invitation'] });
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
