import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@NibrasoftNet/linkbook-commons';

@InputType()
export class AuthForgotPasswordDto {
	@Field(() => String)
	@Transform(lowerCaseTransformer)
	@IsEmail()
	email: string;
}
