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

  async toggleLike({
    videoId,
    userId,
  }: {
    videoId: string
    userId: Types.ObjectId
  }) {
    const isLiked = await this.likeModel.exists({ videoId, user: userId })
    const video = await this.videoModel.findById(videoId)
    if (!video) {
      throw new BadRequestException('No video found with the given ID.')
    }

    if (isLiked) {
      await this.likeModel.deleteOne({ videoId, user: userId })
      await video.updateOne({ $inc: { likesCount: -1 } })
    } else {
      await this.likeModel.create({ videoId, user: userId })
      await video.updateOne({ $inc: { likesCount: +1 } })
    }
  }

  async findVideoLikes(videoId: string) {
    const likes = await this.likeModel
      .find({ videoId })
      .populate('user', 'displayName username photoURL')

    return likes
  }

  async getLikeStatus({
    videoId,
    userId,
  }: {
    videoId: string
    userId: Types.ObjectId
  }) {
    const isLiked = await this.likeModel.exists({ videoId, user: userId })
    return { isLiked: !!isLiked }
  }
}
