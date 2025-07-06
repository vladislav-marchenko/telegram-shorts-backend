import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { User, UserSchema } from './schemas/user.schema'
import { UserModule } from './user/user.module'
import { VideoModule } from './video/video.module'
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.v5ypq4y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    VideoModule,
    LikeModule,
    ViewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
