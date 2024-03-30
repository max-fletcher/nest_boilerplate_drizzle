import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { DrizzleError } from "drizzle-orm";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      console.log('Inside JwtAuthGuard');
      // additional logic that needs to be handled before request reaches server
      return super.canActivate(context)
  }
}