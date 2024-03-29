import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStategy } from './strategies/local.strategy';
import { JwtStategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'abc123', //use a real secret possibly from .env
      signOptions: { expiresIn: '1H' } //use a suitable value possibly from .env
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStategy, JwtStategy],
})
export class AuthModule {}
