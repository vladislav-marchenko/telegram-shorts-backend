import { Injectable } from '@nestjs/common'
import { Connection, Model, Types } from 'mongoose'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { CommentDto } from './dto/comment.dto'
import { Comment } from 'src/schemas/comment.schema'
import { Video } from 'src/schemas/video.schema'

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createComment({
    userId,
    videoId,
    parentId,
    text,
  }: { userId: Types.ObjectId; videoId: string } & CommentDto) {
    const session = await this.connection.startSession()
    session.startTransaction()

    try {
      if (parentId) {
        const parentComment = await this.commentModel
          .findById(parentId)
          .session(session)

        if (!parentComment) {
          throw new Error('Comment you are replying to does not exist')
        }

        await this.commentModel
          .updateOne({ _id: parentId }, { $inc: { repliesCount: 1 } })
          .session(session)
      }

      const comment = await this.commentModel.create(
        [{ user: userId, videoId, parentId, text }],
        { session },
      )

      await this.videoModel
        .updateOne({ _id: videoId }, { $inc: { commentsCount: 1 } })
        .session(session)

      await session.commitTransaction()
      return comment
    } catch (error) {
      await session.abortTransaction()
    } finally {
      session.endSession()
    }
  }

  async findComments({
    videoId,
    page = 1,
    limit = 15,
  }: {
    videoId: string
    page?: number
    limit?: number
  }) {
    const comments = await this.commentModel
      .find({ videoId, parentId: null })
      .sort({ createdAt: -1 })
      .populate('user', 'displayName username photoURL')
      .limit(limit)
      .skip((page - 1) * limit)

    const totalCount = await this.commentModel.countDocuments({
      videoId,
      parentId: null,
    })
    return { comments, hasNext: page * limit < totalCount }
  }

  async findCommentReplies({
    commentId,
    page = 1,
    limit = 5,
  }: {
    commentId: string
    page?: number
    limit?: number
  }) {
    const comments = await this.commentModel
      .find({ parentId: commentId })
      .sort({ createdAt: -1 })
      .populate('user', 'displayName username photoURL')
      .limit(limit)
      .skip((page - 1) * limit)

    const totalCount = await this.commentModel.countDocuments({
      parentId: commentId,
    })
    return { comments, hasNext: page * limit < totalCount }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`
  }

  update(id: number, updateCommentDto: CommentDto) {
    return `This action updates a #${id} comment`
  }

  remove(id: number) {
    return `This action removes a #${id} comment`
  }
}
