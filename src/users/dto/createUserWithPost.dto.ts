import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

// HERE, THE ORDER OF CONDITION MATTERS BECAUSE THE ERROR MESSAGES WILL BE ORDERED BY CONDITION IN REVERSE ORDER
// i.e THE LOWER THE CONDITIONS, THE HIGHER IT WILL GO UP
export class storeUserWithPostDto {
  @Length(3, 300)
  @IsString() 
  @IsNotEmpty()
  name: string
  @Length(1, 300)
  @IsEmail() // All decorators from class-validator is declared above the field like this
  @IsString()
  @IsNotEmpty()
  email: string
  @Length(8, 50)
  @IsString()
  @IsNotEmpty()
  password: string
  @Length(1, 100)
  @IsString()
  @IsNotEmpty()
  title: string
  @Length(1,300)
  @IsString()
  @IsNotEmpty()
  text: string
}
