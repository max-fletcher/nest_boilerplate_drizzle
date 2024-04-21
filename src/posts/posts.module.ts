import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports:[PaginationModule]
})
export class PostsModule {}
