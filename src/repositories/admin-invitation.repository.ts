import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from '../models/invitation.model';

@Injectable()
export class AdminInvitationRepository {
  constructor(
    @InjectRepository(Invitation)
    private readonly repo: Repository<Invitation>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['user'], order: { created_at: 'DESC' } });
  }

  count() {
    return this.repo.count();
  }

  countByStatus(status: string) {
    return this.repo.count({ where: { status: status as any } });
  }
}
