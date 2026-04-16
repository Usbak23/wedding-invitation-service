import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from '../models/gallery.model';
import { Analytic } from '../models/analytic.model';
import { Invitation } from '../models/invitation.model';
import { GalleryRepository } from '../repositories/gallery.repository';
import { AnalyticRepository } from '../repositories/analytic.repository';
import { InvitationRepository } from '../repositories/invitation.repository';
import { GalleryService } from '../services/gallery.service';
import { AnalyticsService } from '../services/analytics.service';
import { GalleryController } from '../controllers/gallery.controller';
import { AnalyticsController } from '../controllers/analytics.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Gallery, Analytic, Invitation])],
    controllers: [GalleryController, AnalyticsController],
    providers: [GalleryService, AnalyticsService, GalleryRepository, AnalyticRepository, InvitationRepository],
    exports: [AnalyticRepository]
})
export class GalleryModule {}
