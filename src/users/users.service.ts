import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as schema from '../db/schema';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, count, eq, like, ne, or } from 'drizzle-orm';
import { users, posts } from '../db/schema';
import * as bcrypt from 'bcrypt';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class UsersService {
  constructor(@Inject('DB_DEV') private databaseService: MySql2Database<typeof schema>, @Inject(PaginationService) private paginationService: PaginationService) {}

  async create(createUserDto: CreateUserDto) {
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
      message: 'User created successfully',
      data: findUser,
    }
  }

  // Strictly for testing DB transactions
  async storeUserWithPost(testingDbTransactionsDto) {

    // COUNT QUERY. USED TO SEE IF DATA ALREADY EXISTS
    let exists = await this.databaseService.select({ count: count() }).from(users).where(eq(users.name, testingDbTransactionsDto.name));

    if(exists[0].count)
      throw new BadRequestException('User with this name already exists.');
    exists = await this.databaseService.select({ count: count() }).from(users).where(eq(users.email, testingDbTransactionsDto.email));
    if(exists[0].count)
      throw new BadRequestException('User with this email already exists.');

    let createdUser
    let createdPost
    const success: boolean = await this.databaseService.transaction(async (tx) => {
      testingDbTransactionsDto.password = await bcrypt.hash(testingDbTransactionsDto.password, 10);
      createdUser = await tx.insert(users).values({
        name: testingDbTransactionsDto.name,
        email: testingDbTransactionsDto.email,
        password: testingDbTransactionsDto.password,
      });

      createdPost = await tx.insert(posts).values({
        user_id: createdUser[0].insertId,
        title: testingDbTransactionsDto.title,
        text: testingDbTransactionsDto.text,
      });

      console.log(createdUser, createdPost);

      return true
    });

    if(!success){
      throw new InternalServerErrorException('Something went wrong. Please try again.')
    }

    const userWithPost = await this.databaseService.query.users.findFirst({ 
                            where: eq(users.id, createdUser[0].insertId),
                            with: { 
                              posts: true 
                            } 
                          });

    return {
      status: 'success',
      message: 'User with post created successfully',
      data: userWithPost,
    }
  }

  async findAll(req, currentPage, limit, search) {
    const builder = this.databaseService.query.users
    const columns = {
      id: true,
      name: true,
      email: true,
      created_at: true
    }
    let options

    // append where & search constraints
    if(search.length){
      options = {
        where: and(
          or(
            like(users.name, '%'+search+'%'),
            like(users.email, '%'+search+'%')
          )
        )
      }
    }

    //  relationships
    const relations = {
      posts: {
        with: {
          comments: true
        }
      }
    }

    const {
      data,
      pageDataCount,
      totalDataCount,
      totalPages,
      next, 
      previous 
    } = await this.paginationService.paginate(req, builder, users, options, relations, currentPage, limit, columns, search)

    return {
      status: 'success',
      message: 'All users',
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
                    .where(
                      and(
                        eq(users.email, updateUserDto.email), ne(users.id, id)
                      )
                    );
    if(exists[0].count)
      throw new BadRequestException('User with this email already exists.');

    if(updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    const result = await this.databaseService.update(users).set(updateUserDto).where(eq(users.id, id));
    const findUser = await this.databaseService.query.users.findFirst({ where: eq(users.id, id) });

    return {
      status: 'success',
      message: 'User updated successfully',
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
      message: 'User deleted successfully'
    }
  }

  // TODO: 2 WAYS OF FETCHING DATA
  // const data = await this.databaseService.query.users.findMany({
  //                       columns: {
  //                         id: true,
  //                         name: true,
  //                         email: true,
  //                         created_at: true
  //                       },
  //                       limit: limit,
  //                       offset: offset
  //                     });

  // // Another way to fetch all data
  // const data = await this.databaseService
  //                   .select({
  //                     id: users.id,
  //                     name: users.name,
  //                     email: users.email,
  //                     created_at: users.created_at 
  //                   })
  //                   .from(users)
  //                   .limit(10)
  //                   .offset(0);
}
