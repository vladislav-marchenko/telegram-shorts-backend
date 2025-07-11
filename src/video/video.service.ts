import { BadRequestException, Injectable } from '@nestjs/common'
import { UploadVideoDto } from './dto/upload-video.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Video } from 'src/schemas/video.schema'
import { S3Service } from 'src/s3/s3.service'
import { ThumbnailService } from 'src/thumbnail/thumbnail.service'
import * as path from 'path'
import { Like } from 'src/schemas/like.schema'

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
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

  async findVideo({
    videoId,
    userId,
  }: {
    videoId: string
    userId: Types.ObjectId
  }) {
    const video = await this.videoModel.findById(videoId).lean()
    if (!video) {
      throw new BadRequestException('No video found with the given ID.')
    }

    const isLiked = await this.likeModel.exists({
      video: new Types.ObjectId(videoId),
      user: userId,
    })

    return { ...video, isLiked: !!isLiked }
  }

  async findVideos({
    userId,
    page = 1,
    limit = 15,
    filter = {},
  }: {
    userId: Types.ObjectId
    page?: number
    limit?: number
    filter?: object
  }) {
    const videos = await this.videoModel.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'likes',
          let: { videoId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user', userId] },
                    { $eq: ['$video', '$$videoId'] },
                  ],
                },
              },
            },
          ],
          as: 'like',
        },
      },
      { $addFields: { isLiked: { $gt: [{ $size: '$like' }, 0] } } },
      { $project: { like: 0 } },
    ])

    const totalCount = await this.videoModel.countDocuments(filter)
    return { videos, hasNext: page * limit < totalCount }
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
