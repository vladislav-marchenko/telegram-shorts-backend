import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model, Types } from 'mongoose'
import { Video } from 'src/schemas/video.schema'
import { View } from 'src/schemas/view.schema'

@Injectable()
export class ViewService {
  constructor(
    @InjectModel(View.name) private viewModel: Model<View>,
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async trackView({
    videoId,
    userId,
  }: {
    videoId: string
    userId: Types.ObjectId
  }) {
    const session = await this.connection.startSession()
    session.startTransaction()

    try {
      const isViewed = await this.viewModel
        .exists({
          video: new Types.ObjectId(videoId),
          user: userId,
        })
        .session(session)

      if (isViewed) return

      await this.viewModel.create(
        [{ video: new Types.ObjectId(videoId), user: userId }],
        { session },
      )
      await this.videoModel
        .findOneAndUpdate(
          { _id: new Types.ObjectId(videoId) },
          { $inc: { views: 1 } },
        )
        .session(session)

      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
}
