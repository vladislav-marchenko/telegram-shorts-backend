import { BadRequestException, Injectable } from '@nestjs/common'
import { Connection, Model, Types } from 'mongoose'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Like } from 'src/schemas/like.schema'
import { Video } from 'src/schemas/video.schema'

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async toggleLike({
    videoId,
    userId,
  }: {
    videoId: string
    userId: Types.ObjectId
  }) {
    const session = await this.connection.startSession()
    session.startTransaction()

    try {
      const like = await this.likeModel
        .findOne({ videoId, user: userId })
        .session(session)

      if (like) {
        await this.likeModel.deleteOne({ _id: like._id }).session(session)
      } else {
        await this.likeModel.create([{ videoId, user: userId }], { session })
      }

      await this.videoModel
        .updateOne({ _id: videoId }, { $inc: { likesCount: !!like ? -1 : 1 } })
        .session(session)

      await session.commitTransaction()
      session.endSession()
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
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
