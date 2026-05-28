import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from '../models/bank-account.model';

@Injectable()
export class BankAccountRepository {
  constructor(
    @InjectRepository(BankAccount)
    private readonly repo: Repository<BankAccount>,
  ) {}

  findByInvitation(invitationId: string) {
    return this.repo.find({
      where: { invitation: { id: invitationId } },
      order: { order_index: 'ASC', created_at: 'ASC' },
    });
  }

  create(data: Partial<BankAccount>) {
    return this.repo.save(this.repo.create(data));
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['invitation'] });
  }
}
