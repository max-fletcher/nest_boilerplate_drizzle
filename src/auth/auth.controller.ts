import { Body, Controller, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService){}

  @Post('api/v1/login')
  @UseGuards(LocalGuard) //using built-in nestJS auth guard with an argument that calls the local strategy that we defined
  async login(@Body() authPayload: AuthPayloadDto){
    const user = await this.authService.validateUser(authPayload)
    console.log('Inside Auth Controller');
    if(!user) throw new NotFoundException('Username or password is not valid')
    return user

    // return this.authService.validateUser(authPayload)
  }
}
