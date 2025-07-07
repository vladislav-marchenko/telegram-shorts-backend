import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, immutable: true, min: 3, required: true })
  telegramId: string

  @Prop({ unique: true, required: true, lowercase: true })
  username: string

  @Prop({ required: true })
  displayName: string

  @Prop({ required: true })
  photoURL?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
