import { Injectable } from '@nestjs/common'
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'

@Injectable()
export class S3Service {
  private readonly client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.S3_ENDPOINT,
  })

  async upload({
    buffer,
    extension = '.jpg',
    contentType = 'image/jpeg',
    folder = 'videos',
  }: {
    buffer: Buffer
    extension?: string
    contentType?: string
    folder?: string
  }) {
    const key = folder + '/' + uuid() + extension

    const params: PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ContentLength: buffer.byteLength,
    }

    await this.client.send(new PutObjectCommand(params))
    return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${key}`
  }

  async delete(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      }),
    )
  }
}
