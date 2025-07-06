import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { View } from 'src/schemas/view.schema'

@Injectable()
export class ViewService {
  constructor(@InjectModel(View.name) private viewModel: Model<View>) {}

  async trackView({
    videoId,
    userId,
  }: {
    videoId: string
    userId: Types.ObjectId
  }) {
    await this.viewModel.create({ video: videoId, user: userId })
  }
}
