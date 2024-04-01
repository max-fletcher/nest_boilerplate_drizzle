import { ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { AuthPayloadDto } from "../dto/auth.dto";
import { plainToClass } from "class-transformer";
import { Request, Response } from 'express';
import { validateSync } from "class-validator";

@Injectable()
export class LocalGuard extends AuthGuard('local'){
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      console.log('Inside LocalGuard');
      // additional logic that needs to be handled before request reaches server

      // VALIDATE SUBMITTED FIELDS USING CLASS VALIDATORS
      // LOGIC TO ACCESS THE REQUEST AND RESPONSE
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();

      // transform the request object to class instance
      const body = plainToClass(AuthPayloadDto, request.body);

      // get a list of errors
      const errors = validateSync(body);

      console.log(errors);

      // extract error messages from the errors array
      const errorMessages = errors.map(({ constraints }) =>
        Object.values(constraints)
      );

      if (errorMessages.length > 0) {
        // return bad request if validation fails
        response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          timestamp: new Date().toISOString(),
          path: request.url,
          response: {
            error: 'Validation Exception',
            message: errorMessages,
          }
        });
      }
      // END VALIDATE SUBMITTED FIELDS USING CLASS VALIDATORS


      return super.canActivate(context)
  }
}