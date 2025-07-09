import { BadRequestException, Injectable } from '@nestjs/common'
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
          throw new BadRequestException(
            'Comment you are replying to does not exist',
          )
        }

        if (!parentComment.user) {
          throw new BadRequestException('You cannot reply to a deleted comment')
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
      throw error
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
      .populate('user')
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
      .populate('user')
      .limit(limit)
      .skip((page - 1) * limit)

    const totalCount = await this.commentModel.countDocuments({
      parentId: commentId,
    })
    return { comments, hasNext: page * limit < totalCount }
  }

  async editComment({
    id,
    userId,
    text,
  }: { id: string; userId: Types.ObjectId } & CommentDto) {
    const comment = await this.commentModel.findById(id)
    if (!comment) {
      throw new BadRequestException('Comment not found')
    }

    if (!comment.user.equals(userId)) {
      throw new BadRequestException('You are not the owner of this comment')
    }

    const updatedComment = await comment.updateOne({ text })
    return updatedComment
  }

  async deleteComment({ id, userId }: { id: string; userId: Types.ObjectId }) {
    const session = await this.connection.startSession()
    session.startTransaction()

    try {
      const comment = await this.commentModel.findById(id).session(session)
      if (!comment) {
        throw new BadRequestException('Comment not found')
      }

      if (!comment.user.equals(userId)) {
        throw new BadRequestException('You are not the owner of this comment')
      }

      const replies = await this.commentModel
        .find({ parentId: comment._id.toString() })
        .session(session)

      if (!!replies.length) {
        const updatedComment = await this.commentModel.findByIdAndUpdate(
          comment._id,
          { text: 'This comment has been deleted', user: null },
          { new: true, session },
        )

        await session.commitTransaction()
        return updatedComment
      }

      await this.videoModel
        .updateOne({ _id: comment.videoId }, { $inc: { commentsCount: -1 } })
        .session(session)

      await comment.deleteOne({ session })
      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
}
