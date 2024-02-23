import { CreateUsersFileDto } from '../../file/dto/create-users-file.dto';
import { Field, InputType } from '@nestjs/graphql';
import {
	IsEmail,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsStrongPassword,
	Validate,
} from 'class-validator';
import {
	IsNotExist,
	lowerCaseTransformer,
} from '@NibrasoftNet/linkbook-commons';
import { Transform } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

@InputType()
export class AuthRegisterLoginDto {
	@Field(() => String)
	@Transform(lowerCaseTransformer)
	@Validate(IsNotExist, [User, 'email'], {
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

	@Field(() => CreateUsersFileDto, { nullable: true })
	@IsOptional()
	@IsObject()
	image?: CreateUsersFileDto;

	@Field(() => String)
	@IsNotEmpty()
	@Validate(IsNotExist, [User, 'phone'], {
		message: 'Phone Number Already Exists',
	})
	phone: string;
}
