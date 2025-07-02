import { BadRequestException, Injectable } from '@nestjs/common'
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

  async findVideo(id: string) {
    const video = await this.videoModel.findById(id)
    if (!video) {
      throw new BadRequestException('No video found with the given ID.')
    }

    return video
  }

  async findUserVideos(userId: string | Types.ObjectId) {
    const videos = await this.videoModel.find({ userId: userId.toString() })
    return videos
  }

  async removeVideo(id: string, userId: Types.ObjectId) {
    const video = await this.videoModel.findById(id)
    if (!video) {
      throw new BadRequestException('No video found with the given ID.')
    }

    if (!userId.equals(video.userId)) {
      throw new BadRequestException('You are not the owner of this video.')
    }

    await video.deleteOne()
  }
}
