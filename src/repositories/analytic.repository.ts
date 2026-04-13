import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytic } from '../models/analytic.model';

@Injectable()
export class AnalyticRepository {
  constructor(
    @InjectRepository(Analytic)
    private readonly repo: Repository<Analytic>,
  ) {}

  create(data: Partial<Analytic>) {
    return this.repo.save(this.repo.create(data));
  }

  countByEvent(invitationId: string, event: string) {
    return this.repo.count({
      where: { invitation: { id: invitationId }, event },
    });
  }

  findAllByInvitation(invitationId: string) {
    return this.repo.find({
      where: { invitation: { id: invitationId } },
      order: { created_at: 'DESC' },
    });
  }
}
