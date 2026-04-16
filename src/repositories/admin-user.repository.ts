import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.model';

@Injectable()
export class AdminUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>
    ) {}

    findAll() {
        return this.repo.find({
            select: ['id', 'name', 'email', 'role', 'created_at'],
            order: { created_at: 'DESC' }
        });
    }

    count() {
        return this.repo.count();
    }

    delete(id: string) {
        return this.repo.delete(id);
    }
}
