// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable()
// export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
// 	constructor(private config: ConfigService) {
// 		super({
// 			jwtFromRequest: ExtractJwt.fromHeader('refresh_token'),
// 			ignoreExpiration: false,
// 			secretOrKey: config.getOrThrow('JWT_SECRET'),
// 		});
// 	}

// 	async validate(payload: any) {
//     console.log('From Inside RefreshToken Strategy Validate');
// 		return { id: payload.sub, email: payload.email };
// 	}
// }