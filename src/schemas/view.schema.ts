import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type ViewDocument = HydratedDocument<View>

@Schema({ timestamps: true })
export class View {
  @Prop({ immutable: true, ref: 'Video', required: true })
  video: Types.ObjectId

  @Prop({ immutable: true, ref: 'User', required: true })
  user: Types.ObjectId
}

export const LikeSchema = SchemaFactory.createForClass(View)
