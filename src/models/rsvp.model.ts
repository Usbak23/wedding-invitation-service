import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { RsvpStatus } from '../types/rsvp-status.type';
import { Guest } from './guest.model';
import { Invitation } from './invitation.model';

@Entity('rsvps')
export class Rsvp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Guest, (guest) => guest.rsvp, { onDelete: 'CASCADE' })
  @JoinColumn()
  guest: Guest;

  @ManyToOne(() => Invitation, { onDelete: 'CASCADE' })
  invitation: Invitation;

  @Column()
  status: RsvpStatus;

  @Column({ default: 1 })
  total_persons: number;

  @Column({ nullable: true, type: 'text' })
  message: string;

  @CreateDateColumn()
  created_at: Date;
}
