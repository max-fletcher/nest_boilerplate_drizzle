import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from "../auth.service";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";

// THIS CLASS IS FOR VERIFYING TOKENS

// makes it so that this service can be imported or injected(i.e dependency injection) into another class's constructor
@Injectable()
export class JwtStategy extends PassportStrategy(Strategy){ // extending a strategy so we can add functionality to it
  // used to call the constructor of its parent class to access the parent's properties and methods
  constructor(private authService: AuthService){
    super({ 
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // this defines that we will extract the token from auth header as bearer token
      ignoreExpiration: false, // if set to true, will ignore the expiration datetime of the JWT
      secretOrKey: 'abc123', // This will be used to decrypt the JWT. Should have the same value as 'secret' in auth.module.ts "JwtModule.register" fn
      usernameField: 'email' // defines that should be used of "username" as  prmary field to identify user
    })
  }

  // custom validate function that will either return a user or an exception(usually should resolves to a boolean)
  // By the time this function is called, the above constructor's super method will have already extracted the JWT and decoded it using secretOrKey
  async validate(payload: any){
    console.log('Inside JWTtrategy Validate')
    console.log(payload)
    return payload

    // const user = await this.authService.validateUser({ email, password })
    // if (!user) throw new UnauthorizedException('User with these credentials not found.');
    // return user
  }
}