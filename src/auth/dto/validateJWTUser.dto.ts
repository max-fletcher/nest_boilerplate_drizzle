import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from "class-validator"
export class validateJWTUserDTO {
  // Using id to check user existance now instead of using name and email
  // @IsString()
  // @IsNotEmpty()
  // @Length(3, 300)
  // name: string
  // @IsString()
  // @IsNotEmpty()
  // @IsEmail() // All decorators from class-validator is declared above the field like this
  // @Length(1, 300)
  // email: string
  @IsNumber()
  @IsNotEmpty()
  id: number
}