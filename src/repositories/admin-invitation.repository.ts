import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from '../models/invitation.model';

@Injectable()
export class AdminInvitationRepository {
    constructor(
        @InjectRepository(Invitation)
        private readonly repo: Repository<Invitation>
    ) {}

    findAll() {
        return this.repo.find({
            relations: ['user'],
            order: { created_at: 'DESC' },
            select: {
                id: true,
                slug: true,
                groom_name: true,
                bride_name: true,
                akad_date: true,
                akad_location: true,
                resepsi_date: true,
                resepsi_location: true,
                status: true,
                template: true,
                created_at: true,
                updated_at: true,
                user: { id: true, name: true, email: true, role: true }
            }
        });
    }

    count() {
        return this.repo.count();
    }

    countByStatus(status: string) {
        return this.repo.count({ where: { status: status as any } });
    }
}
