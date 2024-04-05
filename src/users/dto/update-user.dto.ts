import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string
  @IsString()
  @IsEmail() // All decorators from class-validator is declared above the field like this
  @IsOptional()
  email: string
  @IsString()
  @IsOptional()
  password: string
}
