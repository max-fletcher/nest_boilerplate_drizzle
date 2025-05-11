import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsString, Length, ValidateNested } from "class-validator"

// export class FileDto {
//   name: string;
//   value: number;
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   destination: string;
//   filename: string;
//   path: string;
//   size: number;
// }

// HERE, THE ORDER OF CONDITION MATTERS BECAUSE THE ERROR MESSAGES WILL BE ORDERED BY CONDITION IN REVERSE ORDER
// i.e THE LOWER THE CONDITIONS, THE HIGHER IT WILL GO UP
export class storeUserWithPostAndFileDto {
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
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => FileDto)
  // items: FileDto[];
}
