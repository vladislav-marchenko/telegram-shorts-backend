import { Injectable } from '@nestjs/common'
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
        .findOne({ video: new Types.ObjectId(videoId), user: userId })
        .session(session)

      if (like) {
        await this.likeModel.deleteOne({ _id: like._id }).session(session)
      } else {
        await this.likeModel.create(
          [{ video: new Types.ObjectId(videoId), user: userId }],
          { session },
        )
      }

      await this.videoModel
        .updateOne({ _id: videoId }, { $inc: { likesCount: !!like ? -1 : 1 } })
        .session(session)

      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async findVideoLikes({
    videoId,
    page = 1,
    limit = 10,
  }: {
    videoId: string
    page?: number
    limit?: number
  }) {
    const likes = await this.likeModel
      .find({ video: new Types.ObjectId(videoId) })
      .populate('user')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    const totalCount = await this.likeModel.countDocuments({ video: videoId })
    return { likes, hasNext: page * limit < totalCount }
  }
}
