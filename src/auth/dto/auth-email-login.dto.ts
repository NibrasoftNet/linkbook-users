import { Field, InputType } from '@nestjs/graphql';
import { IsExist, lowerCaseTransformer } from '@NibrasoftNet/linkbook-commons';
import { IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

@InputType()
export class AuthEmailLoginDto {
	@Field(() => String)
	@Transform(lowerCaseTransformer)
	@Validate(IsExist, [User, 'email'], {
		message: 'Email Not Exists',
	})
	email: string;

	@Field(() => String)
	@IsNotEmpty()
	password: string;
}
