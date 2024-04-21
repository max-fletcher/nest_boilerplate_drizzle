import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as schema from '../db/schema';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { and, count, eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { validateJWTUserDTO } from './dto/validateJWTUser.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  // IMPORTING DATABASE AND JWT SERVICE
  constructor( @Inject('DB_DEV') private readonly databaseService: MySql2Database<typeof schema>, private jwtService: JwtService, private configService: ConfigService ) {}

  async register(userData: RegisterDto){
    console.log('Inside Auth Service register');

    // COUNT QUERY. USED TO SEE IF DATA ALREADY EXISTS
    let exists = await this.databaseService.select({ count: count() }).from(users).where(eq(users.name, userData.name));
    if(exists[0].count)
      throw new BadRequestException('User with this name already exists.');
    exists = await this.databaseService.select({ count: count() }).from(users).where(eq(users.email, userData.email));
    if(exists[0].count)
      throw new BadRequestException('User with this email already exists.');

    userData.password = await bcrypt.hash(userData.password, 10);
    // users was imported as * above
    const result = await this.databaseService.insert(users).values(userData);
    const user = await this.databaseService.query.users.findFirst({ where: eq(users.id, result[0].insertId) });

    return {
      status: 'success',
      message: 'Register Successful',
      access_token: this.jwtService.sign({ id: user.id, name: user.name, email: user.email }, { expiresIn: this.configService.getOrThrow('JWT_EXPIRATION_TIME') }),
      refresh_token: this.jwtService.sign({ id: user.id, name: user.name, email: user.email }, { expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXPIRATION_TIME') })
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
      access_token: this.jwtService.sign(user, { expiresIn: this.configService.getOrThrow('JWT_EXPIRATION_TIME') }),
      refresh_token: this.jwtService.sign(user, { expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXPIRATION_TIME') })
    } // returns the JWT
  }

  async validateJWTUser({ name, email }: validateJWTUserDTO ){
    console.log('Inside Auth Service validateLoginUser');
    // users was imported as * above
    const findUser = await this.databaseService.query.users.findFirst({ where: and(eq(users.name, name), eq(users.email, email)) });
    if(!findUser) return null;

    return findUser
  }




  async refreshToken(payload: any) {
		const user = { id: payload.id, name: payload.name, email: payload.email };
    console.log(payload, 'service payload', user, 'service user');
		return {
			access_token: this.jwtService.sign(user),
		};
	}




  // FOR TESTING ONLY
  async falseJWT(data){
    console.log('Inside Auth Service falseJWT');
    return {
      falseJWT: this.jwtService.sign(data)
    }
  }
}
