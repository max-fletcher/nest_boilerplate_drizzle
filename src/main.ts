import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // IMPORTING AND APPLYING STUFF FOR THE CUSTOM ExceptionFilter WE CREATED(next 2 lines)
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))

  // Sets cors to the nest application
  app.enableCors({
    // add multiple origins here
    origin: [
      "http://localhost:3000/",
      // "https://thriveread.com/",
      // "http://yourclient.com",
    ],
  });
  await app.listen(3500);
}
bootstrap();
