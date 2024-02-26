import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadType } from './types/jwt-payload.type';
import { OrNeverType } from '@NibrasoftNet/linkbook-commons';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(configService: ConfigService<AllConfigType>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('auth.secret', { infer: true }),
		});
	}

	public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
		if (!payload.id) {
			throw new UnauthorizedException();
		}
		return payload;
	}
}
