import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type VideoDocument = HydratedDocument<Video>

@Schema({ timestamps: true })
export class Video {
  @Prop({ immutable: true, required: true })
  userId: Types.ObjectId

  @Prop({ required: true, min: 4, max: 50 })
  title: string

  @Prop({ required: true, match: /^https?:\/\/.+/i })
  url: string

  @Prop({ required: true, match: /^https?:\/\/.+/i })
  poster: string

  @Prop({ default: 0 })
  views: number

  @Prop({ default: 0 })
  likesCount: number

  @Prop({ default: 0 })
  commentsCount: number
}

export const VideoSchema = SchemaFactory.createForClass(Video)
