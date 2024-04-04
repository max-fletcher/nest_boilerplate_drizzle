import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"
export class RegisterDto{
  @IsString()
  @IsNotEmpty()
  name: string
  @IsString()
  @IsNotEmpty()
  @IsEmail() // All decorators from class-validator is declared above the field like this
  email: string
  @IsString()
  @IsNotEmpty()
  password: string
}