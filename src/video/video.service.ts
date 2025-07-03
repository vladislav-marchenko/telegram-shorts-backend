import { BadRequestException, Injectable } from '@nestjs/common'
import { UploadVideoDto } from './dto/upload-video.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Video } from 'src/schemas/video.schema'
import { S3Service } from 'src/s3/s3.service'
import { ThumbnailService } from 'src/thumbnail/thumbnail.service'
import * as path from 'path'

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    private s3Service: S3Service,
    private thumbnailService: ThumbnailService,
  ) {}

  async uploadVideo(
    media: Express.Multer.File,
    uploadVideoDto: UploadVideoDto,
    userId: Types.ObjectId,
  ) {
    const videoURL = await this.s3Service.upload({
      buffer: media.buffer,
      extension: path.extname(media.originalname),
      contentType: media.mimetype,
    })

    const thumbnail =
      await this.thumbnailService.extractThumbnailBuffer(videoURL)

    const thumbnailURL = await this.s3Service.upload({
      buffer: thumbnail,
      folder: 'posters',
    })

    const video = await this.videoModel.create({
      title: uploadVideoDto.title,
      url: videoURL,
      poster: thumbnailURL,
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

  async findAllVideos() {
    const videos = await this.videoModel.find()
    return videos
  }

  async deleteVideo(id: string, userId: Types.ObjectId) {
    const video = await this.videoModel.findById(id)
    if (!video) {
      throw new BadRequestException('No video found with the given ID.')
    }

    if (!userId.equals(video.userId)) {
      throw new BadRequestException('You are not the owner of this video.')
    }

    const videoKey = `videos/${video.url.split('/').pop()}`
    await this.s3Service.delete(videoKey)

    const thumbnailKey = `posters/${video.poster.split('/').pop()}`
    await this.s3Service.delete(thumbnailKey)

    await video.deleteOne()
  }
}
