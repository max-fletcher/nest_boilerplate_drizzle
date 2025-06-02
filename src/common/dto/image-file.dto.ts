import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ImageFileDto {
  @IsString()
  @IsNotEmpty()
  fieldname: string
  @IsString()
  @IsNotEmpty()
  originalname: string
  @IsString()
  @IsNotEmpty()
  encoding: string
  @IsString()
  @IsNotEmpty()
  mimetype: string
  @IsString()
  @IsNotEmpty()
  destination: string
  @IsString()
  @IsNotEmpty()
  filename: string
  @IsString()
  @IsNotEmpty()
  path: string
  @IsNumber()
  @IsNotEmpty()
  size: number
}