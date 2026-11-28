import {
  GetObjectCommand,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_DEFAULT_REGION!,
      endpoint: process.env.AWS_ENDPOINT_URL!,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async upload(buffer: Buffer<ArrayBufferLike>, bucket: string, key: string) {
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: buffer,
    };

    await this.s3.putObject(params);

    return key;
  }

  async getPresignedDownloadUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: 'test',
      Key: key,
    });

    return getSignedUrl(this.s3, command, {
      expiresIn: 3000,
    });
  }
}
