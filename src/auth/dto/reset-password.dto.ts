import { Field, Int, InputType, Float } from '@nestjs/graphql';
import {
	IsNotEmpty,
	IsString,
	IsStrongPassword,
	Validate,
} from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';

@InputType()
export class ResetPasswordDto {
	@Field(() => String)
	@IsStrongPassword({
		minLength: 10,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
		minUppercase: 1,
	})
	password: string;

	@Field(() => Int)
	@IsNotEmpty()
	@Validate(IsExist, ['User', 'id'], {
		message: 'User Not Exists',
	})
	userId: number;
}
