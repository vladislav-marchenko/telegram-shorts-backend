import { Injectable } from '@nestjs/common'
import * as ffmpeg from 'fluent-ffmpeg'
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { PassThrough } from 'stream'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

@Injectable()
export class ThumbnailService {
  async extractThumbnailBuffer(videoPath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const stream = new PassThrough()
      const chunks: Buffer[] = []

      ffmpeg(videoPath)
        .setStartTime('00:00:01')
        .frames(1)
        .outputFormat('image2')
        .on('error', reject)
        .on('end', () => {
          resolve(Buffer.concat(chunks))
        })
        .pipe(stream, { end: true })

      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('error', reject)
    })
  }
}
