import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1779951192918 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
                "name" character varying(100) NOT NULL,
                "email" character varying(100) NOT NULL,
                "password" character varying NOT NULL,
                "role" character varying DEFAULT 'user' NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "invitations" (
                "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
                "slug" character varying(100) NOT NULL,
                "groom_name" character varying(100) NOT NULL,
                "groom_nickname" character varying(100),
                "bride_name" character varying(100) NOT NULL,
                "bride_nickname" character varying(100),
                "akad_date" TIMESTAMP,
                "akad_location" text,
                "akad_maps_url" text,
                "resepsi_date" TIMESTAMP,
                "resepsi_location" text,
                "resepsi_maps_url" text,
                "cover_photo" character varying,
                "music_url" character varying,
                "template" character varying DEFAULT 'default' NOT NULL,
                "status" character varying DEFAULT 'draft' NOT NULL,
                "custom_message" text,
                "groom_photo" character varying,
                "bride_photo" character varying,
                "groom_bio" text,
                "bride_bio" text,
                "groom_instagram" character varying(100),
                "bride_instagram" character varying(100),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_dab5f55eaf6f40cb5015f5c34cf" UNIQUE ("slug")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "guests" (
                "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
                "name" character varying(100) NOT NULL,
                "code" character varying(50),
                "phone" character varying(20),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "invitationId" uuid,
                CONSTRAINT "PK_4948267e93869ddcc6b340a2c46" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_44a3657a60b2bfc28c4d226c4a1" UNIQUE ("code")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "rsvps" (
                "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
                "status" character varying NOT NULL,
                "total_persons" integer DEFAULT 1 NOT NULL,
                "message" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "guestId" uuid,
                "invitationId" uuid,
                CONSTRAINT "PK_5d5dda5a5f9fc2f6ba17eefbf86" PRIMARY KEY ("id"),
                CONSTRAINT "REL_022ebe5463d80df2a8b8db2af1" UNIQUE ("guestId")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "galleries" (
                "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
                "photo_url" character varying NOT NULL,
                "caption" character varying(255),
                "order_index" integer DEFAULT 0 NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "invitationId" uuid,
                CONSTRAINT "PK_86b77299615c92db3d68c9c7919" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "analytics" (
                "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
                "event" character varying(50) NOT NULL,
                "ip_address" character varying(50),
                "user_agent" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "invitationId" uuid,
                CONSTRAINT "PK_3c96dcbf1e4c57ea9e0c3144bff" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "bank_accounts" (
                "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
                "bank_name" character varying(100) NOT NULL,
                "account_name" character varying(100) NOT NULL,
                "account_number" character varying(50) NOT NULL,
                "logo_url" character varying,
                "order_index" integer DEFAULT 0 NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "invitationId" uuid,
                CONSTRAINT "PK_c872de764f2038224a013ff25ed" PRIMARY KEY ("id")
            )
        `);

        // Indexes
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_dab5f55eaf6f40cb5015f5c34c" ON "invitations" ("slug")`);
        await queryRunner.query(`CREATE INDEX "IDX_56ce8d405de7cdcedd31d900ba" ON "invitations" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_c16fdad3aea7ec7b047aedb9af" ON "invitations" ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_44a3657a60b2bfc28c4d226c4a" ON "guests" ("code")`);
        await queryRunner.query(`CREATE INDEX "IDX_f1a1e3ce7ddcd20c0d27a61b86" ON "guests" ("invitationId")`);
        await queryRunner.query(`CREATE INDEX "IDX_3f66175f48c60c4c54c70ce6b7" ON "rsvps" ("invitationId")`);
        await queryRunner.query(`CREATE INDEX "IDX_bc622fe82d10c4cf6a98332ab6" ON "rsvps" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_80008f16fb2a3d96257b266169" ON "analytics" ("invitationId")`);
        await queryRunner.query(`CREATE INDEX "IDX_760b2d8ba43565c2acd75ad327" ON "analytics" ("event")`);

        // Foreign keys
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_c16fdad3aea7ec7b047aedb9afe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "guests" ADD CONSTRAINT "FK_f1a1e3ce7ddcd20c0d27a61b86b" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rsvps" ADD CONSTRAINT "FK_022ebe5463d80df2a8b8db2af16" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rsvps" ADD CONSTRAINT "FK_3f66175f48c60c4c54c70ce6b71" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "galleries" ADD CONSTRAINT "FK_87e69edf710946899c3f57fbf06" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "analytics" ADD CONSTRAINT "FK_80008f16fb2a3d96257b2661691" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_b7ade1e6be3400e7602b1d6fac0" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_b7ade1e6be3400e7602b1d6fac0"`);
        await queryRunner.query(`ALTER TABLE "analytics" DROP CONSTRAINT "FK_80008f16fb2a3d96257b2661691"`);
        await queryRunner.query(`ALTER TABLE "galleries" DROP CONSTRAINT "FK_87e69edf710946899c3f57fbf06"`);
        await queryRunner.query(`ALTER TABLE "rsvps" DROP CONSTRAINT "FK_3f66175f48c60c4c54c70ce6b71"`);
        await queryRunner.query(`ALTER TABLE "rsvps" DROP CONSTRAINT "FK_022ebe5463d80df2a8b8db2af16"`);
        await queryRunner.query(`ALTER TABLE "guests" DROP CONSTRAINT "FK_f1a1e3ce7ddcd20c0d27a61b86b"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_c16fdad3aea7ec7b047aedb9afe"`);
        await queryRunner.query(`DROP TABLE "bank_accounts"`);
        await queryRunner.query(`DROP TABLE "analytics"`);
        await queryRunner.query(`DROP TABLE "galleries"`);
        await queryRunner.query(`DROP TABLE "rsvps"`);
        await queryRunner.query(`DROP TABLE "guests"`);
        await queryRunner.query(`DROP TABLE "invitations"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
