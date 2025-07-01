import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { isValid, parse } from '@telegram-apps/init-data-node'
import { Model } from 'mongoose'
import { User, UserDocument } from 'src/schemas/user.schema'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authorization = request.headers.authorization ?? ''
    const initData = authorization.replace('tma ', '')

    const isInitDataValid = isValid(initData, process.env.BOT_TOKEN)
    if (!isInitDataValid) {
      throw new UnauthorizedException('Invalid init data')
    }

    const { id, username, first_name, photo_url } = parse(initData).user
    if (!id) {
      throw new UnauthorizedException('Invalid init data')
    }

    let user: UserDocument
    user = await this.userModel.findOne({ telegramId: id })

    if (!user) {
      user = await this.userModel.create({
        telegramId: id,
        username: username,
        displayName: first_name,
        photoURL: photo_url,
        createdAt: new Date(),
      })
    }

    request['user'] = user
    return true
  }
}
