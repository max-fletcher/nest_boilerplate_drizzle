import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import * as schema from './db/schema';
import { DrizzleMySqlModule } from '@knaadh/nestjs-drizzle-mysql2';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';

@Module({
  imports: [
    DrizzleMySqlModule.register({
    tag: 'DB_DEV',
    mysql: {
      connection: 'client',
      config: {
        host: "127.0.0.1",
        user: "root",
        password : "",
        database: "nest_boilerplate_drizzle",
      },
    },
    config: { schema: { ...schema }, mode: 'default' },
    }),
    UsersModule,
    AuthModule,
    // Defining throttle/rate-limit logic globally. You can define multiple rate-limits here each with their own set of names and 
    // apply them to different routes(see docs).
    ThrottlerModule.forRoot([
      // DEFAULT RATE LIMITERS. YOU CAN SKIP THIS USING USING @SkipThrottle OR OVERRIDE THIS USING @Throttle({ default: { ttl: ???, limit: ??? } })
      {
        ttl: 60000,
        limit: 5
      },
    ]),
    CustomLoggerModule
  ],
  controllers: [AppController],
  providers: [
      AppService,
      // this binds the throttle/rate-limiter guard globally. You can bind it in many ways though(see docs).
      {
        provide: APP_GUARD,
        useClass: ThrottlerGuard
      }
    ],
})
export class AppModule {}
