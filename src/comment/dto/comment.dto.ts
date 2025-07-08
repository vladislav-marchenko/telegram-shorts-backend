import { IsString, Length } from 'class-validator'

export class CommentDto {
  @IsString()
  @Length(4, 350)
  text: string

  @IsString()
  parentId?: string
}
