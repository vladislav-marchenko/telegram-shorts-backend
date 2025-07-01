import { IsString, Length } from 'class-validator'

export class UploadVideoDto {
  @IsString()
  @Length(4, 50)
  title: string
}
