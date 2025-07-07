import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Comment, CommentSchema } from 'src/schemas/comment.schema'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UserModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
