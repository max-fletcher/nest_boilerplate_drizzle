import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as schema from '../db/schema';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, count, eq, ne } from 'drizzle-orm';
import { users } from '../db/schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject('DB_DEV') private databaseService: MySql2Database<typeof schema>) {}

  async create(createUserDto: CreateUserDto) {
    console.log('Create User Service');

    // COUNT QUERY. USED TO SEE IF DATA ALREADY EXISTS
    let exists = await this.databaseService.select({ count: count() }).from(users).where(eq(users.name, createUserDto.name));

    if(exists[0].count)
      throw new BadRequestException('User with this name already exists.');
    exists = await this.databaseService.select({ count: count() }).from(users).where(eq(users.email, createUserDto.email));
    if(exists[0].count)
      throw new BadRequestException('User with this email already exists.');

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const result = await this.databaseService.insert(users).values(createUserDto);
    const findUser = await this.databaseService.query.users.findFirst({ where: eq(users.id, result[0].insertId) });

    return {
      status: 'success',
      message: 'User created successful',
      data: findUser,
    }
  }

  async findAll(limit, offset) {
    // This is how you select specific fields. You can also use the other syntax shown below.
    const data = await this.databaseService.query.users.findMany({
                          columns: {
                            id: true,
                            name: true,
                            email: true,
                            created_at: true
                          },
                          limit: limit,
                          offset: offset
                        });

    // Another way to fetch all data
    // const data = await this.databaseService
    //                   .select({ 
    //                     id: users.id,
    //                     name: users.name,
    //                     email: users.email,
    //                     created_at: users.created_at 
    //                   })
    //                   .from(users);

    return {
      status: 'success',
      message: 'All users',
      data: data,
    }
  }

  async findOne(id: number) {
    const findUser = await this.databaseService.query.users
                            .findFirst({
                              where: eq(users.id, id),
                              columns: {
                                id: true,
                                name: true,
                                email: true,
                                created_at: true
                              }
                            });

    if(!findUser) 
      throw new NotFoundException('User not found.')

    return {
      status: 'success',
      message: 'User found',
      data: findUser,
    }

    // Another way to fetch data but this fetches an array so you need to use .length and array index (i.e findUser[0]) to be properly used
    // const findUser = await this.databaseService
    //                         .select({ 
    //                           id: users.id,
    //                           name: users.name,
    //                           email: users.email,
    //                           created_at: users.created_at 
    //                         })
    //                         .from(users)
    //                         .where(eq(users.id, id))
    //                         .limit(1);

    // if(findUser.length === 0)
    //   throw new NotFoundException('User not found.')

    // return {
    //   status: 'success',
    //   message: 'User found',
    //   data: findUser[0],
    // }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let exists = await this.databaseService.select({ count: count() }).from(users).where(eq(users.id, id));
    if(!exists[0].count)
      throw new BadRequestException('User not found.');

    // COUNT QUERY. USED TO SEE IF DATA ALREADY EXISTS
    exists = await this.databaseService.select({ count: count() }).from(users)
                    .where(and(eq(users.name, updateUserDto.name), ne(users.id, id)));
    if(exists[0].count)
      throw new BadRequestException('User with this name already exists.');
    exists = await this.databaseService.select({ count: count() }).from(users)
                    .where(and(eq(users.email, updateUserDto.email), ne(users.id, id)));
    if(exists[0].count)
      throw new BadRequestException('User with this email already exists.');

    if(updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    const result = await this.databaseService.update(users).set(updateUserDto).where(eq(users.id, id));
    const findUser = await this.databaseService.query.users.findFirst({ where: eq(users.id, id) });

    return {
      status: 'success',
      message: 'User updated',
      data: findUser,
    }
  }

  async remove(id: number) {
    let exists = await this.databaseService.select({ count: count() }).from(users).where(eq(users.id, id));
    if(!exists[0].count)
      throw new BadRequestException('User not found.');

    const result = await this.databaseService.delete(users).where(eq(users.id, id));

    return {
      status: 'success',
      message: 'User deleted'
    }
  }
}
