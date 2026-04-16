import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
    storage: diskStorage({
        destination: './src/uploads',
        filename: (_, file, cb) => {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
            cb(null, `${unique}${extname(file.originalname)}`);
        }
    }),
    fileFilter: (_: any, file: Express.Multer.File, cb: any) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
        if (!allowed.includes(extname(file.originalname).toLowerCase())) {
            return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
};
