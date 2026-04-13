import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { InvitationStatus } from '../types/invitation-status.type';
import { User } from './user.model';
import { Guest } from './guest.model';
import { Gallery } from './gallery.model';

@Entity('invitations')
@Index(['slug'])
@Index(['status'])
@Index(['user'])
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.invitations, { onDelete: 'CASCADE' })
  user: User;

  @Column({ unique: true, length: 100 })
  slug: string;

  @Column({ length: 100 })
  groom_name: string;

  @Column({ length: 100 })
  bride_name: string;

  @Column({ nullable: true })
  akad_date: Date;

  @Column({ nullable: true, type: 'text' })
  akad_location: string;

  @Column({ nullable: true })
  resepsi_date: Date;

  @Column({ nullable: true, type: 'text' })
  resepsi_location: string;

  @Column({ nullable: true })
  cover_photo: string;

  @Column({ nullable: true })
  music_url: string;

  @Column({ default: 'default' })
  template: string;

  @Column({ default: 'draft' })
  status: InvitationStatus;

  @Column({ nullable: true, type: 'text' })
  custom_message: string;

  @OneToMany(() => Guest, (guest) => guest.invitation)
  guests: Guest[];

  @OneToMany(() => Gallery, (gallery) => gallery.invitation)
  galleries: Gallery[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
