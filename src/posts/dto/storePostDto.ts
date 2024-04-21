import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator"
export class CreatePostDto{
  @IsNumber()
  @IsNotEmpty()
  user_id: number
  @IsString()
  @IsNotEmpty()
  @Length(1, 300)
  title: string
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  text: string
}