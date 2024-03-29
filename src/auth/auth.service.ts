import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import * as schema from '../db/schema';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { JwtService } from '@nestjs/jwt';

// import { createCipheriv, randomBytes, scrypt } from 'crypto';
// import { promisify } from 'util';

@Injectable()
export class AuthService {
  // IMPORTING DATABASE AND JWT SERVICE
  constructor( @Inject('DB_DEV') private readonly databaseService: MySql2Database<typeof schema>, private jwtService: JwtService ) {}

  async validateUser({ email, password }: AuthPayloadDto){
    const findUser = await this.databaseService.query.users
                            .findFirst({
                              where: eq(users.email, email)
                            });
    console.log('Inside Auth Service validateUser');
    if(!findUser) return null;
    const decryptedPassword = findUser.password // TODO: encrypt and decrypt needed here
    if(password !== decryptedPassword) return null
    const user = { id: findUser.id, name: findUser.name, email: findUser.email }
    return {
      status: 'success',
      message: 'Login Successful',
      jwt: this.jwtService.sign(user)
    } // returns the JWT
  }
}
