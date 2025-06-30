import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { isValidObjectId, Model, ObjectId, Types } from 'mongoose'
import { User } from 'src/schemas/user.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getMe(id: ObjectId) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format.')
    }

    const user = await this.userModel.findById(id)
    if (!user) {
      throw new BadRequestException('No user found with the given ID.')
    }

    return user
  }
}
