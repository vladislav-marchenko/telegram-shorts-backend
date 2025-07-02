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
import { isValidObjectId, Types } from 'mongoose'
import { UpdateProfileDto } from './dto/update-user.dto'
import { AuthRequest } from 'src/types'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  findMe(@Req() request: AuthRequest) {
    const userId = request.user._id
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid user ID format.')
    }

    return this.userService.getUser(userId)
  }

  @Get(':id')
  find(@Param('id') userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid user ID format.')
    }

    return this.userService.getUser(userId)
  }

  @Patch()
  @UseGuards(AuthGuard)
  updateDetails(
    @Req() request: AuthRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfileInfo(
      request.user._id,
      updateProfileDto,
    )
  }
}
