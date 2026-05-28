import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invitation } from './invitation.model';

@Entity('bank_accounts')
export class BankAccount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Invitation, (invitation) => invitation.bankAccounts, { onDelete: 'CASCADE' })
    invitation: Invitation;

    @Column({ length: 100 })
    bank_name: string;

    @Column({ length: 100 })
    account_name: string;

    @Column({ length: 50 })
    account_number: string;

    @Column({ nullable: true })
    logo_url: string;

    @Column({ default: 0 })
    order_index: number;

    @CreateDateColumn()
    created_at: Date;
}
