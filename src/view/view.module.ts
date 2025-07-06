import { Module } from '@nestjs/common'
import { ViewService } from './view.service'
import { ViewController } from './view.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { View, ViewSchema } from 'src/schemas/view.schema'
import { UserModule } from 'src/user/user.module'
import { VideoModule } from 'src/video/video.module'
import { Video, VideoSchema } from 'src/schemas/video.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: View.name, schema: ViewSchema }]),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    UserModule,
    VideoModule,
  ],
  controllers: [ViewController],
  providers: [ViewService],
})
export class ViewModule {}
