import { Module } from '@nestjs/common'
import { VideoService } from './video.service'
import { VideoController } from './video.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Video, VideoSchema } from 'src/schemas/video.schema'
import { S3Module } from 'src/s3/s3.module'
import { UserModule } from 'src/user/user.module'
import { ThumbnailService } from 'src/thumbnail/thumbnail.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    UserModule,
    S3Module,
  ],
  controllers: [VideoController],
  providers: [VideoService, ThumbnailService],
})
export class VideoModule {}
