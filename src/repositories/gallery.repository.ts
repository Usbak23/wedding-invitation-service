import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from '../models/gallery.model';

@Injectable()
export class GalleryRepository {
  constructor(
    @InjectRepository(Gallery)
    private readonly repo: Repository<Gallery>,
  ) {}

  findAllByInvitation(invitationId: string) {
    return this.repo.find({
      where: { invitation: { id: invitationId } },
      order: { order_index: 'ASC' },
    });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['invitation'] });
  }

  create(data: Partial<Gallery>) {
    return this.repo.save(this.repo.create(data));
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
