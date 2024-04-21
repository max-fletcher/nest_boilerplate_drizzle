import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ConfigService } from '@nestjs/config';

// THIS CLASS IS FOR VERIFYING TOKENS

// makes it so that this service can be imported or injected(i.e dependency injection) into another class's constructor
@Injectable()
export class JwtStategy extends PassportStrategy(Strategy, 'jwt-strategy'){ // extending a strategy so we can add functionality to it
  // used to call the constructor of its parent class to access the parent's properties and methods
  constructor(private authService: AuthService, private configService: ConfigService){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // this defines that we will extract the token from auth header as bearer token
      ignoreExpiration: false, // if set to true, will ignore the expiration datetime of the JWT
      secretOrKey: configService.getOrThrow('JWT_SECRET'), // This will be used to decrypt the JWT. Should have the same value as 'secret' in auth.module.ts "JwtModule.register" fn
      usernameField: 'email' // defines that should be used of "username" as  prmary field to identify user
    })
  }

  // custom validate function that will either return a user or an exception(usually should resolves to a boolean)
  // By the time this function is called, the above constructor's super method will have already extracted the JWT and decoded it using secretOrKey
  // It is here you can check if this JWT matches any database records i.e username and email, else throw an error
  async validate(payload: any){
    console.log('Inside JWTStrategy Validate')
    console.log('payload', payload)

    // validating user by seeing if a user with this email & name exists in database
    const user = await this.authService.validateJWTUser(payload)
    if (!user) throw new UnauthorizedException('Invalid JWT Token provided.');

    return payload
  }
}