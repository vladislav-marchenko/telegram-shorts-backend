import { Injectable } from '@nestjs/common'
import { UploadVideoDto } from './dto/upload-video.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Video } from 'src/schemas/video.schema'
import { S3Service } from 'src/s3/s3.service'

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    private s3Service: S3Service,
  ) {}

  async uploadVideo(
    media: Express.Multer.File,
    uploadVideoDto: UploadVideoDto,
    userId: Types.ObjectId,
  ) {
    const url = await this.s3Service.uploadFile(media)
    const video = await this.videoModel.create({
      title: uploadVideoDto.title,
      url,
      userId,
    })

    return video
  }

  findVideo(id: number) {
    return `This action returns a #${id} video`
  }

  findUserVideos(id: string) {
    return `This action returns all videos for user ${id}`
  }

  removeVideo(id: number) {
    return `This action removes a #${id} video`
  }
}
