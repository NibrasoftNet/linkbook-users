import { Field, InputType, Int } from '@nestjs/graphql';
import { IsExist } from '@NibrasoftNet/linkbook-commons';
import { IsNotEmpty, IsStrongPassword, Validate } from 'class-validator';
import { User } from '../../users/entities/user.entity';

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
	@Validate(IsExist, [User, 'id'], {
		message: 'User Not Exists',
	})
	userId: number;
}
