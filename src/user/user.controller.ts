import {
  BadRequestException,
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
import { isValidObjectId, Types } from 'mongoose'
import { UpdateProfileDto } from './user.dto'
import { AuthRequest } from 'src/types'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  getMe(@Req() request: AuthRequest, @Param('id') id: string) {
    const userId = id === 'me' ? request.user._id : id
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid user ID format.')
    }

    return this.userService.getUser(userId)
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateProfileInfo(
    @Req() request: AuthRequest,
    @Body() newData: UpdateProfileDto,
  ) {
    return this.userService.updateProfileInfo(request.user._id, newData)
  }
}
