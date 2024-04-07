import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(3, 300)
  name: string
  @IsString()
  @IsOptional()
  @IsEmail() // All decorators from class-validator is declared above the field like this
  @Length(1, 300)
  email: string
  @IsString()
  @IsOptional()
  @Length(8, 50)
  password: string
}
