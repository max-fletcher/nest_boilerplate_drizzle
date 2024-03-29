import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as schema from '../db/schema';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';

@Injectable()
export class UsersService {
  constructor( @Inject('DB_PROD') private databaseService: MySql2Database<typeof schema> ) {}
  async create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const users = await this.databaseService.query.users.findMany();
    return users;
  }

  async findOne(id: number) {
    const findUser = await this.databaseService.query.users
                            .findFirst({
                              where: eq(users.id, 1)
                            });

    return findUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
