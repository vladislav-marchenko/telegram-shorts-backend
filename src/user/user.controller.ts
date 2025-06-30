import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { Request } from 'express'
import { Types } from 'mongoose'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() request: Request) {
    try {
      const user = request['user']
      return this.userService.getMe(user._id)
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }

      throw new InternalServerErrorException('Something went wrong.')
    }
  }
}
