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

  @Get(':id')
  @UseGuards(AuthGuard)
  find(@Req() request: AuthRequest, @Param('id') id: string) {
    const userId = id === 'me' ? request.user._id : id
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
