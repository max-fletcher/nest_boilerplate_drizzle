import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private configService: ConfigService) {
    console.log('here2');
    console.log(ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromHeader('refresh_token'), configService.getOrThrow('JWT_SECRET'));
		super({
			jwtFromRequest: ExtractJwt.fromHeader('refresh_token'),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow('JWT_SECRET'),
      usernameField: 'email'
		});
	}

	async validate(payload: any) {
    console.log('Inside RefreshJwtStrategy Validate');
		return payload;
	}
}