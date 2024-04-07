import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"
export class AuthPayloadDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail() // All decorators from class-validator is declared above the field like this
  @Length(1, 300)
  email: string
  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  password: string
}