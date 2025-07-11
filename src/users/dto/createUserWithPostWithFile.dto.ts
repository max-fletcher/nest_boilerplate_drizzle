import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDefined, IsEmail, IsNotEmpty, IsString, Length, ValidateNested } from "class-validator"
import { ImageFileDto } from "src/common/dto/image-file.dto";
import { ImageExtFileValidation, ImageMimetypeFileValidation } from "src/common/validators/image-file.validator";

// HERE, THE ORDER OF CONDITION MATTERS BECAUSE THE ERROR MESSAGES WILL BE ORDERED BY CONDITION IN REVERSE ORDER
// i.e THE LOWER THE CONDITIONS, THE HIGHER IT WILL GO UP
export class StoreUserWithPostAndImageFileDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 300)
  name: string
  @IsNotEmpty()
  @IsString()
  @Length(1, 300)
  @IsEmail() // All decorators from class-validator is declared above the field like this
  email: string
  @IsNotEmpty()
  @IsString()
  @Length(8, 50)
  password: string
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  title: string
  @IsNotEmpty()
  @IsString()
  @Length(1,300)
  text: string
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ImageFileDto)
  @ImageExtFileValidation({ message: 'Avatar must be an image file' })
  @ImageMimetypeFileValidation({ message: 'Avatar must be an image file' })
  avatar: ImageFileDto[];
  // @IsNotEmpty()
  // @ValidateNested({ each: true })
  // @IsArray()
  // @ArrayNotEmpty()
  // @Type(() => ImageFileDto)
  // @ImageExtFileValidation({ message: 'Background must be an image file' })
  // @ImageMimetypeFileValidation({ message: 'Background must be an image file' })
  // background: ImageFileDto[];
}
