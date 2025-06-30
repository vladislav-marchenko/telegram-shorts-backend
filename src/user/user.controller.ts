import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
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

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() request: Request) {
    const user = request['user']
    return this.userService.getMe(user._id)
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
