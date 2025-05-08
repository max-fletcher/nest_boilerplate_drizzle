import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query, Req, ValidationPipe, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { storeUserWithPostDto } from './dto/createUserWithPost.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storeUserWithPostAndFileDto } from './dto/createUserWithPostWithFile.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  findAll(
    @Req() req: Request,
    @Query('currentPage', new DefaultValuePipe(0), ParseIntPipe) currentPage: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    return this.usersService.findAll(req, currentPage, limit, search);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  create(@Body(new ValidationPipe({whitelist: true})) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Strictly for testing DB transactions
  @Post('store_user_with_post')
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  testing_db_transactions(@Body(new ValidationPipe({whitelist: true})) storeUserWithPostDto: storeUserWithPostDto) {
    return this.usersService.storeUserWithPost(storeUserWithPostDto);
  }



  // @Post('store_user_with_post_with_file')
  // @UseInterceptors(FileInterceptor('file'))
  // async upload(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() body: any,
  // ) {
  //   // Validate the body manually since we're using raw `any`
  //   const dto = plainToInstance(storeUserWithPostAndFileDto, body);
  //   const errors = await validate(dto);

  //   if (errors.length > 0) {
  //     const formattedErrors = {};
  //     errors.forEach(err => {
  //       formattedErrors[err.property] = Object.values(err.constraints);
  //     });
  //     throw new BadRequestException({ message: 'Validation failed', errors: formattedErrors });
  //   }

  //   // Manually validate file
  //   if (!file) {
  //     throw new BadRequestException({ message: 'File is required' });
  //   }
  //   if (!file.mimetype.startsWith('image/')) {
  //     throw new BadRequestException({ message: 'Only image files are allowed' });
  //   }

  //   return {
  //     message: 'File and body validated successfully',
  //     file: file.originalname,
  //     data: dto,
  //   };
  // }



  @Patch(':id')
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist: true})) updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
