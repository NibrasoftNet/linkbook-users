import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
	JwtRefreshPayloadType,
	OrNeverType,
} from '@NibrasoftNet/linkbook-commons';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor(configService: ConfigService<AllConfigType>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('auth.refreshSecret', {
				infer: true,
			}),
		});
	}

	public validate(
		payload: JwtRefreshPayloadType,
	): OrNeverType<JwtRefreshPayloadType> {
		if (!payload.sessionId) {
			throw new UnauthorizedException();
		}
		return payload;
	}
}
