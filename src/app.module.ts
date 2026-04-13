import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';
import jwtConfig from './configs/jwt.config';
import { User } from './models/user.model';
import { Invitation } from './models/invitation.model';
import { Guest } from './models/guest.model';
import { Rsvp } from './models/rsvp.model';
import { Gallery } from './models/gallery.model';
import { Analytic } from './models/analytic.model';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './routes/auth.module';
import { InvitationModule } from './routes/invitation.module';
import { GalleryModule } from './routes/gallery.module';
import { AdminModule } from './routes/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        entities: [User, Invitation, Guest, Rsvp, Gallery, Analytic],
        synchronize: config.get('app.env') === 'development',
        logging: false,
      }),
    }),
    AuthModule,
    InvitationModule,
    GalleryModule,
    AdminModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
