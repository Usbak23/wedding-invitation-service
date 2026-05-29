import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { multerConfig, getFileUrl } from '../integrations/storage.integration';
import { successResponse } from '../helpers/response.helper';

@ApiTags('Upload')
@ApiBearerAuth('access-token')
@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
    @Post()
    @ApiOperation({ summary: 'Upload file (foto/musik) ke S3/MinIO' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: { file: { type: 'string', format: 'binary' } }
        }
    })
    @UseInterceptors(FileInterceptor('file', multerConfig))
    upload(@UploadedFile() file: Express.Multer.File) {
        const key = (file as unknown as { key: string }).key;
        return successResponse({ url: getFileUrl(key) }, 'File uploaded');
    }
}
