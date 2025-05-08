import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // IMPORTING AND APPLYING STUFF FOR THE CUSTOM ExceptionFilter WE CREATED(next 2 lines)
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))

  // FUNCTION THAT IS AS A FACTORY(SEE BELOW INSIDE app.useGlobalPipes) TO STRUCTURE ERRORS IN A DESIRED FORM
  function extractNestedErrors(errors: ValidationError[]): Record<string, string[]> {
    const result = {};
    errors.forEach((error) => {
      if (error.constraints) {
        result[error.property] = Object.values(error.constraints); // REPLACE LINE BELOW WITH THIS IS YOU WANT ALL VAL ERRORS AS ARRAY
        result[error.property] = Object.values(error.constraints)[0];
      } else if (error.children && error.children.length > 0) {
        // result[error.property] = extractNestedErrors(error.children); // REPLACE LINE BELOW WITH THIS IS YOU WANT ALL VAL ERRORS AS ARRAY
        result[error.property] = extractNestedErrors(error.children)[0];
      }
    });
    return result;
  }

  // USING A CUSTOM VALIDATION PIPE GLOBALLY TO FORMAT ERRORS TO A DESIRED FORM
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = {};

        errors.forEach((error) => {
          if (error.constraints) {
            // formattedErrors[error.property] = Object.values(error.constraints); // REPLACE LINE BELOW WITH THIS IS YOU WANT ALL VAL ERRORS AS ARRAY
            formattedErrors[error.property] = Object.values(error.constraints)[0];
          } else if (error.children && error.children.length > 0) {
            // formattedErrors[error.property] = extractNestedErrors(error.children); // REPLACE LINE BELOW WITH THIS IS YOU WANT ALL VAL ERRORS AS ARRAY
            formattedErrors[error.property] = extractNestedErrors(error.children)[0];
          }
        });

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );

  // Sets cors to the nest application
  app.enableCors({
    // add multiple origins here
    origin: [
      "http://localhost:3000",
      // "https://thriveread.com",
      // "http://yourclient.com",
    ],
    credentials: true,
  });
  await app.listen(3500);
}
bootstrap();
