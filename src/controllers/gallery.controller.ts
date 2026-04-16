import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { GalleryService } from '../services/gallery.service';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { ParseUuidPipe } from '../middlewares/parse-uuid.pipe';
import { multerConfig } from '../integrations/storage.integration';
import { successResponse } from '../helpers/response.helper';

@ApiTags('Gallery')
@ApiBearerAuth('access-token')
@Controller('api/invitations/:invitationId/gallery')
@UseGuards(JwtAuthGuard)
export class GalleryController {
    constructor(private readonly galleryService: GalleryService) {}

    @Get()
    @ApiOperation({ summary: 'List foto gallery undangan' })
    async findAll(@Param('invitationId', ParseUuidPipe) invitationId: string, @Req() req: any) {
        const data = await this.galleryService.findAll(invitationId, req.user.id);
        return successResponse(data);
    }

    @Post()
    @ApiOperation({ summary: 'Upload foto ke gallery' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                photo: { type: 'string', format: 'binary' },
                caption: { type: 'string' }
            }
        }
    })
    @UseInterceptors(FileInterceptor('photo', multerConfig))
    async upload(@Param('invitationId', ParseUuidPipe) invitationId: string, @UploadedFile() file: Express.Multer.File, @Body('caption') caption: string, @Req() req: any) {
        const data = await this.galleryService.upload(invitationId, req.user.id, file, caption);
        return successResponse(data, 'Photo uploaded');
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Hapus foto dari gallery' })
    async delete(@Param('id', ParseUuidPipe) id: string, @Req() req: any) {
        await this.galleryService.delete(id, req.user.id);
        return successResponse(null, 'Photo deleted');
    }
}
