import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query, Req, ValidationPipe, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/storePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('api/v1/posts')
export class PostsController {
  constructor(private postsService: PostsService){}

  @Post()
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  create(@Body(new ValidationPipe({whitelist: true})) createUserDto: CreatePostDto) {
    return this.postsService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  findAll(
    @Req() req: Request,
    @Query('currentPage', new DefaultValuePipe(0), ParseIntPipe) currentPage: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    return this.postsService.findAll(req, currentPage, limit, search);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist: true})) updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
