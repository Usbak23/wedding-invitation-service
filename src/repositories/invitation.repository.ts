import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from '../models/invitation.model';

@Injectable()
export class InvitationRepository {
  constructor(
    @InjectRepository(Invitation)
    private readonly repo: Repository<Invitation>,
  ) {}

  findAllByUser(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'guests', 'galleries'],
    });
  }

  findBySlug(slug: string) {
    return this.repo.findOne({
      where: { slug },
      relations: ['galleries'],
    });
  }

  findByIdAndUser(id: string, userId: string) {
    return this.repo.findOne({
      where: { id, user: { id: userId } },
    });
  }

  slugExists(slug: string) {
    return this.repo.existsBy({ slug });
  }

  create(data: Partial<Invitation>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: string, data: Partial<Invitation>) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
