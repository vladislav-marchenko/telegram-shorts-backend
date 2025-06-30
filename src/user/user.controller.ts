import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { Request } from 'express'
import { Types } from 'mongoose'
import { UpdateProfileDto } from './user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  getMe(@Req() request: Request, @Param('id') id: string) {
    const userId = id === 'me' ? request['user']._id : new Types.ObjectId(id)
    return this.userService.getUser(userId)
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateProfileInfo(
    @Req() request: Request,
    @Body() newData: UpdateProfileDto,
  ) {
    const user = request['user']
    return this.userService.updateProfileInfo(user._id, newData)
  }
}
