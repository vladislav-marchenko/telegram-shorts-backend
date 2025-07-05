import { Module } from '@nestjs/common'
import { LikeService } from './like.service'
import { LikeController } from './like.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Like, LikeSchema } from 'src/schemas/like.schema'
import { UserModule } from 'src/user/user.module'
import { VideoModule } from 'src/video/video.module'
import { Video, VideoSchema } from 'src/schemas/video.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    UserModule,
    VideoModule,
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
