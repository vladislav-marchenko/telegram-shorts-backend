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
  findMyVideos(@Req() request: AuthRequest) {
    return this.videoService.findUserVideos(request.user._id)
  }

  @Get('user/:id')
  findUserVideos(@Param('id') userId: string) {
    return this.videoService.findUserVideos(userId)
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.videoService.findVideo(id)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  remove(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.videoService.removeVideo(id, request.user._id)
  }
}
