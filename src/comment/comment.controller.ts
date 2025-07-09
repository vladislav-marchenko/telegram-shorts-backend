import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
} from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentDto } from './dto/comment.dto'
import { AuthGuard } from 'src/auth/auth.guard'
import { AuthRequest } from 'src/types'

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':videoId')
  @UseGuards(AuthGuard)
  create(
    @Request() request: AuthRequest,
    @Param('videoId') videoId: string,
    @Body() { text, parentId }: CommentDto,
  ) {
    return this.commentService.createComment({
      userId: request.user._id,
      videoId,
      parentId,
      text,
    })
  }

  @Get(':videoId')
  find(@Param('videoId') videoId: string, @Query('page') page: number) {
    return this.commentService.findComments({ videoId, page })
  }

  @Get('replies/:commentId')
  findReplies(
    @Param('commentId') commentId: string,
    @Query('page') page: number,
  ) {
    return this.commentService.findCommentReplies({ commentId, page })
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Request() request: AuthRequest,
    @Param('id') id: string,
    @Body() { text }: CommentDto,
  ) {
    return this.commentService.editComment({
      id,
      userId: request.user._id,
      text,
    })
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  remove(@Request() request: AuthRequest, @Param('id') id: string) {
    return this.commentService.deleteComment({ id, userId: request.user._id })
  }
}
