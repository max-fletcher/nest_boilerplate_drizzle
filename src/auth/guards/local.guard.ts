import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class LocalGuard extends AuthGuard('local'){
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      console.log('Inside LocalGuard');
      // additional logic that needs to be handled before request reaches server
      return super.canActivate(context)
  }
}