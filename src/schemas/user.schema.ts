import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  telegramId: string

  @Prop({ unique: true, required: true })
  username: string

  @Prop({ required: true })
  displayName: string

  @Prop({ required: true })
  createdAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
