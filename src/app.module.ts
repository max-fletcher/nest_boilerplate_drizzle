import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import * as schema from './db/schema';
import { DrizzleMySqlModule } from '@knaadh/nestjs-drizzle-mysql2';
import { AuthModule } from './auth/auth.module';

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
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
