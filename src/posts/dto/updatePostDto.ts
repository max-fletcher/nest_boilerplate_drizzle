import { IsNumber, IsString, Length } from "class-validator"
export class UpdatePostDto{
  @IsNumber()
  user_id: number
  @IsString()
  @Length(1, 300)
  title: string
  @IsString()
  @Length(1, 50)
  text: string
}