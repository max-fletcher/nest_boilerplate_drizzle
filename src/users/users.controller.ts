import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query, Req, ValidationPipe, UseGuards, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, HttpCode, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { storeUserWithPostDto } from './dto/createUserWithPost.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { deleteMultipleFileLocal, diskStorageEngine, multipleFileLocalFullPathResolver, rollbackMultipleFileLocalUpload } from 'src/utils/multer.utils';
import { Request } from 'express';
import { StoreUserWithPostAndImageFileDto } from './dto/createUserWithPostWithFile.dto';

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
      const data = plainToInstance(StoreUserWithPostAndImageFileDto, {...body, ...files});
      const errors = await validate(data);

      const formattedFiles = multipleFileLocalFullPathResolver(req, files)

      console.log('formattedFiles', formattedFiles)
  
      if (errors.length > 0) {
        const formattedErrors = {};
        errors.forEach(err => {
          formattedErrors[err.property] = Object.values(err.constraints).reverse(); // reversed so that class-validator errors are in correct order(it sucks tbh...)
        });
        throw new UnprocessableEntityException({ message: 'Validation failed', errors: formattedErrors });
      }

      const storeData = { ...data, avatar: formattedFiles && formattedFiles.avatar ? formattedFiles.avatar[0] : undefined }

      return await this.usersService.storeUserWithPostWithFile(storeData);
    } catch (error) {
      console.log('error', error)
      rollbackMultipleFileLocalUpload(req)
      console.log('store_user_with_post_with_file error', error);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
    ], {
    storage: diskStorageEngine('avatar'),
    })
  )
  async update(
    @Param('id') id: string, 
    @Req() req: Request, 
    @UploadedFiles() files: { avatar?: Express.Multer.File[] }, @Body() body: any
  ) {
      try {
        // Validate the body manually since we're using raw `any`
        const data = plainToInstance(UpdateUserDto, {...body, ...files}); // Transform JS object to a Class(as per the 1st param)
        const errors = await validate(data);

        if (errors.length > 0) {
          const formattedErrors = {};
          errors.forEach(err => {
            formattedErrors[err.property] = Object.values(err.constraints).reverse(); // reversed so that class-validator errors are in correct order(it sucks tbh...)
          });
          throw new UnprocessableEntityException({ message: 'Validation failed', errors: formattedErrors });
        }

        const user = await this.usersService.findOne(+id);
        const formattedFiles = multipleFileLocalFullPathResolver(req, files)
        if(formattedFiles && user.data.avatar) 
          deleteMultipleFileLocal(req, [user.data.avatar])
        const updateUserData = { ...data, avatar: formattedFiles && formattedFiles.avatar ? formattedFiles.avatar[0] : undefined }

        return await this.usersService.update(+id, updateUserData);
      } catch (error) {
        console.log('error', error)
        rollbackMultipleFileLocalUpload(req)
        throw error;
      }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user = await this.usersService.findOne(+id);
    if(user.data.avatar)
      deleteMultipleFileLocal(req, [user.data.avatar])

    return this.usersService.remove(+id);
  }
}
