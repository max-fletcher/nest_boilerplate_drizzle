import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PaginationService } from 'src/pagination/pagination.service';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[PaginationModule]
})

export class UsersModule {}