import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invitation } from './invitation.model';

@Entity('analytics')
@Index(['invitation'])
@Index(['event'])
export class Analytic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invitation, { onDelete: 'CASCADE' })
  invitation: Invitation;

  @Column({ length: 50 })
  event: string; // view | rsvp_open | share

  @Column({ nullable: true, length: 50 })
  ip_address: string;

  @Column({ nullable: true, type: 'text' })
  user_agent: string;

  @CreateDateColumn()
  created_at: Date;
}
