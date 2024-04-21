import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterDto } from './dto/register.dto';
import { RefreshJwtAuthGuard } from './guards/refreshToken.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService){}

  @Post('api/v1/register')
  async register(@Body(new ValidationPipe({whitelist: true})) body: RegisterDto){
    console.log('Inside Auth Controller Register');
    return this.authService.register(body)
  }

  @Post('api/v1/login')
  @UseGuards(LocalGuard) //using a custom guard that we made by extending local strategy
  login(@Req() req: Request){
    console.log('Inside Auth Controller Login');
    // since the validate method in jwt strategy appends the user to the request
    return req.user
  }

  @Get('api/v1/status')
  @UseGuards(JwtAuthGuard) //using guard to protect this route
  status(@Req() req: Request){
    console.log('Inside Auth Controller Status');
    return req.user
  }

	@Post('api/v1/refresh')
	@UseGuards(RefreshJwtAuthGuard)
	async refreshToken(@Req() req) {
		return this.authService.refreshToken(req.user);
	}

  // FOR TESTING ONLY
  @Get('api/v1/false_jwt')
  falseJWT(@Body() body){
    console.log('Inside Auth Controller falseJWT');
    return this.authService.falseJWT(body)
  }
}
