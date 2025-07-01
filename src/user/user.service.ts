import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { User } from 'src/schemas/user.schema'
import { UpdateProfileDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUser(id: Types.ObjectId | string) {
    const user = await this.userModel.findById(id, {
      telegramId: 0,
      createdAt: 0,
      __v: 0,
    })
    if (!user) {
      throw new BadRequestException('No user found with the given ID.')
    }

    return user
  }

  async updateProfileInfo(
    id: Types.ObjectId,
    updateProfileDto: UpdateProfileDto,
  ) {
    if ('telegramId' in updateProfileDto) {
      throw new BadRequestException('Cannot update telegramId.')
    }

    const user = await this.userModel.findOne({
      username: updateProfileDto.username,
    })
    if (user && !user._id.equals(id)) {
      throw new BadRequestException('Username is already taken.')
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateProfileDto },
      { new: true },
    )
    return updatedUser
  }
}
