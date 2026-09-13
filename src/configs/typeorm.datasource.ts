import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../models/user.model';
import { Invitation } from '../models/invitation.model';
import { Guest } from '../models/guest.model';
import { Rsvp } from '../models/rsvp.model';
import { Gallery } from '../models/gallery.model';
import { Analytic } from '../models/analytic.model';
import { BankAccount } from '../models/bank-account.model';
import { InitialSchema1779951192918 } from '../migrations/1779951192918-InitialSchema';

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'wedding_invitation',
    entities: [User, Invitation, Guest, Rsvp, Gallery, Analytic, BankAccount],
    migrations: [InitialSchema1779951192918]
});
