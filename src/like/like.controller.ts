import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  HttpCode,
  Query,
} from '@nestjs/common'
import { LikeService } from './like.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { AuthRequest } from 'src/types'

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('toggle/:videoId')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  like(@Request() request: AuthRequest, @Param('videoId') videoId: string) {
    return this.likeService.toggleLike({ videoId, userId: request.user._id })
  }

  @Get(':videoId')
  findVideoLikes(
    @Param('videoId') videoId: string,
    @Query('page') page: number,
  ) {
    return this.likeService.findVideoLikes({ videoId, page })
  }

  @Get('status/:videoId')
  @UseGuards(AuthGuard)
  likeStatus(
    @Request() request: AuthRequest,
    @Param('videoId') videoId: string,
  ) {
    return this.likeService.getLikeStatus({ videoId, userId: request.user._id })
  }
}
