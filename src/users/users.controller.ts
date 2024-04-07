import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query, Req, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { storeUserWithPostDto } from './dto/create-user-with-post.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(new ValidationPipe({whitelist: true})) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Strictly for testing DB transactions
  @Post('store_user_with_post')
  testing_db_transactions(@Body(new ValidationPipe({whitelist: true})) storeUserWithPostDto: storeUserWithPostDto) {
    return this.usersService.storeUserWithPost(storeUserWithPostDto);
  }

  @Get()
  findAll(
    @Req() req: Request,
    @Query('currentPage', new DefaultValuePipe(0), ParseIntPipe) currentPage: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    return this.usersService.findAll(req, currentPage, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist: true})) updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
