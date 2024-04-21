import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('jwt-refresh') {
  // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  //   console.log('Inside RefreshJwtAuthGuard');
  //   // additional logic that needs to be handled before request reaches server
  //   return super.canActivate(context)
  // }
}
