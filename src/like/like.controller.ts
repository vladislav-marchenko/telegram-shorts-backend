import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common'
import { LikeService } from './like.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { AuthRequest } from 'src/types'

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':videoId')
  @UseGuards(AuthGuard)
  like(@Request() request: AuthRequest, @Param('videoId') videoId: string) {
    return this.likeService.likeVideo({ videoId, userId: request.user._id })
  }

  @Get(':videoId')
  findVideoLikes(@Param('videoId') videoId: string) {
    return this.likeService.findVideoLikes(videoId)
  }

  @Delete(':videoId')
  @HttpCode(204)
  unlike(@Request() request: AuthRequest, @Param('videoId') videoId: string) {
    return this.likeService.unlikeVideo({ videoId, userId: request.user._id })
  }
}
