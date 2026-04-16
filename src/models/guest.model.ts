import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invitation } from './invitation.model';
import { Rsvp } from './rsvp.model';

@Entity('guests')
@Index(['code'])
@Index(['invitation'])
export class Guest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Invitation, (invitation) => invitation.guests, {
        onDelete: 'CASCADE'
    })
    invitation: Invitation;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true, nullable: true, length: 50 })
    code: string;

    @Column({ nullable: true, length: 20 })
    phone: string;

    @OneToOne(() => Rsvp, (rsvp) => rsvp.guest)
    rsvp: Rsvp;

    @CreateDateColumn()
    created_at: Date;
}
