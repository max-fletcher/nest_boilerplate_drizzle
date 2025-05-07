import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[PaginationModule]
})

export class UsersModule {}