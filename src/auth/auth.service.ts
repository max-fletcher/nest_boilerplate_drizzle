import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as schema from '../db/schema';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { validateJWTUserDTO } from './dto/validateJWTUser.dto';

@Injectable()
export class AuthService {
  // IMPORTING DATABASE AND JWT SERVICE
  constructor( @Inject('DB_DEV') private readonly databaseService: MySql2Database<typeof schema>, private jwtService: JwtService ) {}

  async register(userData: RegisterDto){
    console.log('Inside Auth Service register');
    let exists = await this.databaseService.query.users.findFirst({ where: eq(users.name, userData.name) });
    if(exists)
      throw new BadRequestException('User with this name already exists.');
    exists = await this.databaseService.query.users.findFirst({ where: eq(users.email, userData.email) });
    if(exists)
      throw new BadRequestException('User with this email already exists.');

    userData.password = await bcrypt.hash(userData.password, 10);
    // users was imported as * above
    const result = await this.databaseService.insert(users).values(userData);
    const user = await this.databaseService.query.users.findFirst({ where: eq(users.id, result[0].insertId) });

    return {
      status: 'success',
      message: 'Register Successful',
      jwt: this.jwtService.sign({ id: user.id, name: user.name, email: user.email }),
    } // returns the JWT
  }

  async validateLoginUser({ email, password }: AuthPayloadDto){
    console.log('Inside Auth Service validateLoginUser');
    // users was imported as * above
    const findUser = await this.databaseService.query.users.findFirst({ where: eq(users.email, email) });
    if(!findUser) return null;
    const match = await bcrypt.compare(password, findUser.password);
    if(!match) return null
    const user = { id: findUser.id, name: findUser.name, email: findUser.email }

    return {
      status: 'success',
      message: 'Login Successful',
      jwt: this.jwtService.sign(user)
    } // returns the JWT
  }

  async validateJWTUser({ name, email }: validateJWTUserDTO ){
    console.log('Inside Auth Service validateLoginUser');
    // users was imported as * above
    const findUser = await this.databaseService.query.users.findFirst({ where: and(eq(users.name, name), eq(users.email, email)) });
    if(!findUser) return null;

    return findUser
  }





  // FOR TESTING ONLY
  async falseJWT(data){
    console.log('Inside Auth Service falseJWT');
    return {
      falseJWT: this.jwtService.sign(data)
    }
  }
}