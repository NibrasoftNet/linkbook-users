import { Field, InputType } from '@nestjs/graphql';
import {
	IsEmail,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsStrongPassword,
	Validate,
} from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@NibrasoftNet/linkbook-commons';
import { CreateFileDto } from '../../file/dto/create-file.dto';

@InputType()
export class AuthRegisterLoginDto {
	@Field(() => String)
	@Transform(lowerCaseTransformer)
	@Validate(IsNotExist, ['User', 'email'], {
		message: 'Email Already Exists',
	})
	@IsEmail()
	email: string;

	@Field(() => String)
	@IsStrongPassword({
		minLength: 10,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
		minUppercase: 1,
	})
	password: string;

	@Field(() => String)
	@IsNotEmpty()
	firstName: string;

	@Field(() => String)
	@IsNotEmpty()
	lastName: string;

	@Field(() => CreateFileDto, { nullable: true })
	@IsOptional()
	@IsObject()
	image?: CreateFileDto;

	@Field(() => String)
	@IsNotEmpty()
	@Validate(IsNotExist, ['User', 'phone'], {
		message: 'Phone Number Already Exists',
	})
	phone: string;
}
