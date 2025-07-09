import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type CommentDocument = HydratedDocument<Comment>

@Schema({ timestamps: true })
export class Comment {
  @Prop({ immutable: true, required: true })
  videoId: Types.ObjectId

  @Prop()
  parentId?: Types.ObjectId

  @Prop({ immutable: true, ref: 'User', required: true })
  user: Types.ObjectId | null

  @Prop({ required: true, min: 4, max: 350 })
  text: string

  @Prop({ default: 0 })
  repliesCount: number
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
