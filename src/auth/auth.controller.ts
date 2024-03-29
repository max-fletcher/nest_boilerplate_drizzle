import { Body, Controller, Get, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService){}

  @Post('api/v1/login')
  @UseGuards(LocalGuard) //using a custom guard that we made by extending local strategy
  async login(@Body() authPayload: AuthPayloadDto){
    console.log('Inside Auth Controller Login');
    return this.authService.validateUser(authPayload)
  }

  @Get('api/v1/status')
  @UseGuards(JwtAuthGuard) //using a custom guard that we made by extending jwt strategy
  status(@Req() req: Request){
    console.log('Inside Auth Controller Status');
    return req.user
  }
}
