import { Module } from '@nestjs/common'
import { ViewService } from './view.service'
import { ViewController } from './view.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { View, ViewSchema } from 'src/schemas/view.schema'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: View.name, schema: ViewSchema }]),
    UserModule,
  ],
  controllers: [ViewController],
  providers: [ViewService],
})
export class ViewModule {}
