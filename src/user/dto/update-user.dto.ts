import { IsOptional, IsString, Length, IsUrl } from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  username?: string

  @IsOptional()
  @IsString()
  @Length(2, 50)
  displayName?: string

  @IsOptional()
  @IsString()
  @IsUrl()
  photoURL?: string
}
