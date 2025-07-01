import { BadRequestException } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

const MAX_VIDEO_SIZE = 100 * 1024 * 1024

export const videoMulterOptions = (): MulterOptions => {
  return {
    limits: { fileSize: MAX_VIDEO_SIZE },
    fileFilter: (_request, file, callback) => {
      if (!file.mimetype.startsWith('video/')) {
        return callback(
          new BadRequestException('Only video files are allowed.'),
          false,
        )
      }
      callback(null, true)
    },
  }
}
