import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@NibrasoftNet/linkbook-commons';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthForgotPasswordDto {
	@Field(() => String)
	@Transform(lowerCaseTransformer)
	@IsEmail()
	email: string;
}
