import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from '../models/invitation.model';
import { getPaginationOptions, PaginationQuery } from '../utils/pagination.util';

@Injectable()
export class InvitationRepository {
    constructor(
        @InjectRepository(Invitation)
        private readonly repo: Repository<Invitation>
    ) {}

    async findAllByUser(userId: string, pagination: PaginationQuery) {
        const { skip, limit } = getPaginationOptions(pagination);
        const [data, total] = await this.repo.findAndCount({
            where: { user: { id: userId } },
            order: { created_at: 'DESC' },
            skip,
            take: limit
        });
        return { data, total };
    }

    findById(id: string) {
        return this.repo.findOne({
            where: { id },
            relations: ['user', 'guests', 'galleries'],
            select: {
                user: { id: true, name: true, email: true, role: true }
            }
        });
    }

    findBySlug(slug: string) {
        return this.repo.findOne({
            where: { slug },
            relations: ['galleries']
        });
    }

    findByIdAndUser(id: string, userId: string) {
        return this.repo.findOne({
            where: { id, user: { id: userId } },
            select: {
                user: { id: true }
            }
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
