import { BadRequestException, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { randomUUID } from 'crypto';
import { S3Service } from '../storage/s3.service';

@Injectable()
export class UploadService {
  constructor(private readonly s3: S3Service) {}

  async uploadTempPhoto(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file?.buffer?.length) throw new BadRequestException('Nenhum arquivo enviado.');
    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('Arquivo deve ser uma imagem.');

    const webp = await (sharp as any)(file.buffer)
      .rotate()
      .resize(512, 512, { fit: 'cover' })
      .webp({ quality: 86 })
      .toBuffer();

    const key = `avatars/tmp/${randomUUID()}.webp`;
    const url = await this.s3.uploadFile(key, webp, 'image/webp');
    return { url };
  }
}
