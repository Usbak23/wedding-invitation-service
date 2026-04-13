import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invitation } from './invitation.model';

@Entity('galleries')
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invitation, (invitation) => invitation.galleries, {
    onDelete: 'CASCADE',
  })
  invitation: Invitation;

  @Column()
  photo_url: string;

  @Column({ nullable: true, length: 255 })
  caption: string;

  @Column({ default: 0 })
  order_index: number;

  @CreateDateColumn()
  created_at: Date;
}
