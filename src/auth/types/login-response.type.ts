import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class LoginResponse {
	@Field(() => String)
	token: string;

	@Field(() => String)
	refreshToken: string;

	@Field(() => Number)
	tokenExpires: number;

	@Field(() => User, { nullable: true })
	user: User;
}
