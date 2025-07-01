import { Injectable } from '@nestjs/common'
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'
import * as path from 'path'

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

  async uploadFile(file: Express.Multer.File, folder = 'videos') {
    const extension = path.extname(file.originalname)
    const key = `${folder}/${uuid()}${extension}`

    const params: PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }

    await this.client.send(new PutObjectCommand(params))
    return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${key}`
  }
}
