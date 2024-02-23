import { Field, InputType, Int } from '@nestjs/graphql';
import { IsExist } from '@NibrasoftNet/linkbook-commons';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { User } from '../../users/entities/user.entity';

@InputType()
export class ConfirmEmailDto {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	otp: string;

	@Field(() => Int)
	@IsNotEmpty()
	@Validate(IsExist, [User, 'id'], {
		message: 'User Not Exists',
	})
	userId: number;
}
