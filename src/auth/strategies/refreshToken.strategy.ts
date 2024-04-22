import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

// IMP: DON'T FORGET TO ADD email: "mail@mail.com" IN BODY OF "/refresh" ELSE THIS WILL NOT WORK
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private authService: AuthService, private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromHeader('refresh_token'),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow('JWT_SECRET'),
      // usernameField: 'email'
		});
	}

	async validate(payload: any) {
    console.log('Inside RefreshJwtStrategy Validate');
    console.log('payload', payload)

    // validating user by seeing if a user with this email exists in database
    const user = await this.authService.validateRefreshJWTUser(payload)
    if (!user) throw new UnauthorizedException('Invalid Refresh Token provided.');
		return payload;
	}
}