import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

// THIS CLASS IS FOR GENERATING TOKENS AS OPPOSED TO VERIFYING TOKENS

// @Injectable() makes it so that this service can be added into the providers array of a module AND THEN 
// injected(i.e dependency injection) into another class's constructor
@Injectable()
export class LocalStategy extends PassportStrategy(Strategy){ // extending a strategy so we can add functionality to it
  // used to call the constructor of its parent class to access the parent's properties and methods
  constructor(private authService: AuthService){
    super({ 
      usernameField: 'email' // defines that should be used of "username" as  prmary field to identify user
    })
  }

  // custom validate function that will either return a user or an exception(usually should resolves to a boolean)
  async validate(email: string, password: string){
    console.log('Inside LocalStrategy Validate');
    // this will run the validateUser function to make sure user is logged in, for every request
    const user = await this.authService.validateUser({ email, password })
    if (!user) throw new UnauthorizedException('User with these credentials not found.');
    return user
    // return this.authService.validateUser({ email, password })
  }
}