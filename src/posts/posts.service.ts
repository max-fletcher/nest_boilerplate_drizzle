import { BadRequestException, Body, Inject, Injectable, InternalServerErrorException, NotFoundException, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from './dto/storePostDto';
import { UpdatePostDto } from './dto/updatePostDto';
import * as schema from '../db/schema';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, count, eq, like, ne, or } from 'drizzle-orm';
import { posts } from '../db/schema';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class PostsService {
  constructor(@Inject('DB_DEV') private databaseService: MySql2Database<typeof schema>, @Inject(PaginationService) private paginationService: PaginationService) {}

  async findAll(req, currentPage, limit, search) {
    const builder = this.databaseService.query.posts

    const columns = {
      id: true,
      title: true,
      text: true,
      created_at: true
    }

    let options

    // append where & search constraints
    if(search.length){
      options = {
        where: and(
          or(
            like(posts.title, '%'+search+'%'),
            like(posts.text, '%'+search+'%')
          )
        )
      }
    }

    //  relationships
    const relations = {
      user: true,
      comments: true
    }

    const {
      data,
      pageDataCount,
      totalDataCount,
      totalPages,
      next, 
      previous 
    } = await this.paginationService.paginate(req, builder, posts, options, relations, currentPage, limit, columns, search)

    return {
      status: 'success',
      message: 'All posts',
      response: {
        pageDataCount,
        totalDataCount,
        totalPages,
        next, 
        previous,
        data
      },
    }
  }

  async findOne(id: number) {
    const findPost = await this.databaseService.query.posts
                            .findFirst({
                              where: eq(posts.id, id),
                              columns: {
                                id: true,
                                title: true,
                                text: true,
                                created_at: true
                              }
                            });

    if(!findPost) 
      throw new NotFoundException('Post not found.')

    return {
      status: 'success',
      message: 'Post found',
      data: findPost,
    }
  }

  async create(createPostDto: CreatePostDto) {
    const result = await this.databaseService.insert(posts).values(createPostDto);
    const findPost = await this.databaseService.query.posts.findFirst({ where: eq(posts.id, result[0].insertId) });

    return {
      status: 'success',
      message: 'Post created successfully',
      data: findPost,
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    let exists = await this.databaseService.select({ count: count() }).from(posts).where(eq(posts.id, id));
    if(!exists[0].count)
      throw new BadRequestException('Post not found.');

    const result = await this.databaseService.update(posts).set(updatePostDto).where(eq(posts.id, id));
    const findPost = await this.databaseService.query.posts.findFirst({ where: eq(posts.id, id) });

    return {
      status: 'success',
      message: 'Post updated successfully',
      data: findPost,
    }
  }

  async remove(id: number) {
    let exists = await this.databaseService.select({ count: count() }).from(posts).where(eq(posts.id, id));
    if(!exists[0].count)
      throw new BadRequestException('Post not found.');

    const result = await this.databaseService.delete(posts).where(eq(posts.id, id));

    return {
      status: 'success',
      message: 'Post deleted successfully'
    }
  }

}
