import { BadRequestException, Injectable } from '@nestjs/common'
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Like } from 'src/schemas/like.schema'
import { Video } from 'src/schemas/video.schema'

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
  ) {}

  async likeVideo({
    videoId,
    userId,
  }: {
    videoId: string
    userId: Types.ObjectId
  }) {
    const existingLike = await this.likeModel.findOne({ videoId, user: userId })
    if (existingLike) {
      throw new BadRequestException('You have already liked this video.')
    }

    const video = await this.videoModel.findByIdAndUpdate(videoId, {
      $inc: { likesCount: 1 },
    })
    if (!video) {
      throw new BadRequestException('No video found with the given ID.')
    }

    const like = await this.likeModel.create({ videoId, user: userId })
    return like
  }

  async findVideoLikes(videoId: string) {
    const likes = await this.likeModel
      .find({ videoId })
      .populate('user', 'displayName username photoURL')

    return likes
  }

  async unlikeVideo({
    videoId,
    userId,
  }: {
    videoId: string
    userId: Types.ObjectId
  }) {
    const existingLike = await this.likeModel.findOne({ videoId, userId })
    if (!existingLike) {
      throw new BadRequestException('You have not liked this video yet.')
    }

    const video = await this.videoModel.findByIdAndUpdate(videoId, {
      $inc: { likesCount: -1 },
    })
    if (!video) {
      throw new BadRequestException('No video found with the given ID.')
    }

    await this.likeModel.deleteOne({ videoId, userId })
  }
}
