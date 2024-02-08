import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGoogleLoginDto } from './dto/create-auth-google.dto';
import { SocialInterface } from '../utils/types/social.interface';
import { OAuth2Client } from 'google-auth-library';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class AuthGoogleService {
	private google: OAuth2Client;

	constructor(private configService: ConfigService<AllConfigType>) {
		this.google = new OAuth2Client(
			configService.get('google.clientId', { infer: true }),
			configService.get('google.clientSecret', { infer: true }),
		);
	}
	async getProfileByToken(
		authGoogleLoginDto: AuthGoogleLoginDto,
	): Promise<SocialInterface> {
		const ticket = await this.google.verifyIdToken({
			idToken: authGoogleLoginDto.idToken,
			audience: [
				this.configService.getOrThrow('google.clientId', {
					infer: true,
				}),
			],
		});

		const data = ticket.getPayload();

		if (!data) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						user: 'wrongToken',
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		return {
			id: data.sub,
			email: data.email,
			firstName: data.given_name,
			lastName: data.family_name,
		};
	}
}
