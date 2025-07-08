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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: CommentDto) {
    return this.commentService.update(+id, updateCommentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id)
  }
}
