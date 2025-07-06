import {
  Controller,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ViewService } from './view.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { AuthRequest } from 'src/types'

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Post(':videoId')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  track(@Request() request: AuthRequest, @Param('videoId') videoId: string) {
    return this.viewService.trackView({ userId: request.user._id, videoId })
  }
}
