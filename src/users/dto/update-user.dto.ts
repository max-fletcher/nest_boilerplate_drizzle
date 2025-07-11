import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { ImageFileDto } from 'src/common/dto/image-file.dto';
import { ImageExtFileValidation, ImageMimetypeFileValidation } from 'src/common/validators/image-file.validator';
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
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ImageFileDto)
  @ImageExtFileValidation({ message: 'Avatar must be an image file' })
  @ImageMimetypeFileValidation({ message: 'Avatar must be an image file' })
  avatar: ImageFileDto[];
}
