import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    region: process.env.S3_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin'
    },
    forcePathStyle: true // required for MinIO
});

const bucket = process.env.S3_BUCKET || 'wedding';

export const multerConfig = {
    storage: multerS3({
        s3: s3Client,
        bucket,
        metadata: (_, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (_, file, cb) => {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
            cb(null, `uploads/${unique}${extname(file.originalname)}`);
        }
    }),
    fileFilter: (_: unknown, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.mp3', '.m4a', '.ogg', '.wav'];
        if (!allowed.includes(extname(file.originalname).toLowerCase())) {
            return cb(new BadRequestException('File type not allowed'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
};

export function getFileUrl(key: string): string {
    return `${process.env.S3_ENDPOINT || 'http://localhost:9000'}/${bucket}/${key}`;
}

export async function deleteFile(key: string): Promise<void> {
    await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
