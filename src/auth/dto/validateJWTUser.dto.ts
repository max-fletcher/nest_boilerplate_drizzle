import { IsEmail, IsNotEmpty, IsString } from "class-validator"
export class validateJWTUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string
  @IsString()
  @IsNotEmpty()
  @IsEmail() // All decorators from class-validator is declared above the field like this
  email: string
}