import { IsEmail, IsNotEmpty, IsString } from "class-validator"
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string
  @IsString()
  @IsEmail() // All decorators from class-validator is declared above the field like this
  @IsNotEmpty()
  email: string
  @IsString()
  @IsNotEmpty()
  password: string
}
