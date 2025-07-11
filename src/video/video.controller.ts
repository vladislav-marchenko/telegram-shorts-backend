import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpCode,
  Query,
} from '@nestjs/common'
import { VideoService } from './video.service'
import { UploadVideoDto } from './dto/upload-video.dto'
import { AuthRequest } from 'src/types'
import { AuthGuard } from 'src/auth/auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { videoMulterOptions } from 'src/helpers/multer'

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('media', videoMulterOptions()))
  upload(
    @UploadedFile() media: Express.Multer.File,
    @Body() uploadVideoDto: UploadVideoDto,
    @Request() request: AuthRequest,
  ) {
    return this.videoService.uploadVideo(media, uploadVideoDto, request.user.id)
  }

  @Get('user/me')
  @UseGuards(AuthGuard)
  findMyVideos(@Req() request: AuthRequest, @Query('page') page: number) {
    return this.videoService.findVideos({
      userId: request.user._id,
      page,
      filter: { userId: request.user._id.toString() },
    })
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  findUserVideos(
    @Request() request: AuthRequest,
    @Param('id') userId: string,
    @Query('page') page: number,
  ) {
    return this.videoService.findVideos({
      userId: request.user._id,
      page,
      filter: { userId },
    })
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  findFeed(@Request() request: AuthRequest, @Query('page') page: number) {
    return this.videoService.findVideos({
      userId: request.user._id,
      limit: 5,
      page,
    })
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  find(@Request() request: AuthRequest, @Param('id') id: string) {
    return this.videoService.findVideo({
      videoId: id,
      userId: request.user._id,
    })
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  remove(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.videoService.deleteVideo(id, request.user._id)
  }
}
