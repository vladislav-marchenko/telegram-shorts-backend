import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type LikeDocument = HydratedDocument<Like>

@Schema({ timestamps: true })
export class Like {
  @Prop({ immutable: true, required: true })
  videoId: Types.ObjectId

  @Prop({ immutable: true, ref: 'User', required: true })
  user: Types.ObjectId
}

export const LikeSchema = SchemaFactory.createForClass(Like)
