import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query, Req, ValidationPipe, UseGuards, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, HttpCode, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { storeUserWithPostDto } from './dto/createUserWithPost.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { diskStorageEngine, multipleFileLocalFullPathResolver, rollbackMultipleFileLocalUpload } from 'src/utils/multer.utils';
import { Request } from 'express';
import { storeUserWithPostAndImageFileDto } from './dto/createUserWithPostWithFile.dto';

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
  @HttpCode(201)
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  create(@Body(new ValidationPipe({whitelist: true})) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Strictly for testing DB transactions
  @Post('store_user_with_post')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  testing_db_transactions(@Body(new ValidationPipe({whitelist: true})) storeUserWithPostDto: storeUserWithPostDto) {
    return this.usersService.storeUserWithPost(storeUserWithPostDto);
  }



  @Post('store_user_with_post_with_file')
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ], {
    storage: diskStorageEngine('avatar'),
    })
  )
  async upload(
    @Req() req: Request,
    @UploadedFiles() files: { avatar?: Express.Multer.File[], background?: Express.Multer.File[] },
    @Body() body: any,
  ) {
    try {
      // Validate the body manually since we're using raw `any`
      const dto = plainToInstance(storeUserWithPostAndImageFileDto, {...body, ...files});
      const errors = await validate(dto);

      const formattedFiles = multipleFileLocalFullPathResolver(req, files)
  
      if (errors.length > 0) {
        const formattedErrors = {};
        errors.forEach(err => {
          formattedErrors[err.property] = Object.values(err.constraints).reverse(); // reversed so that class-validator errors are in correct order(it sucks tbh...)
        });
        throw new UnprocessableEntityException({ message: 'Validation failed', errors: formattedErrors });
      }

      const storeData = { ...dto, avatar: formattedFiles.avatar[0] }

      return await this.usersService.storeUserWithPostWithFile(storeData);

      // // Manually validate file
      // if (!files.avatar[0]) {
      //   throw new BadRequestException({ message: 'File is required' });
      // }
      // if (!files.avatar[0].mimetype.startsWith('image/')) {
      //   throw new BadRequestException({ message: 'Only image files are allowed' });
      // }
  
      // if (!files.background[0]) {
      //   throw new BadRequestException({ message: 'File is required' });
      // }
      // if (!files.background[0].mimetype.startsWith('image/')) {
      //   throw new BadRequestException({ message: 'Only image files are allowed' });
      // }
  
      return {
        message: 'File and body validated successfully',
        files: formattedFiles,
        // data: res,
      };
    } catch (error) {
      console.log('error', error)
      rollbackMultipleFileLocalUpload(req)
      console.log('store_user_with_post_with_file error', error);
      throw error;
    }
  }



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
