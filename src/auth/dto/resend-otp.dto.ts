import { Field, Int, InputType, Float } from '@nestjs/graphql';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '@NibrasoftNet/linkbook-commons';
import { User } from '../../users/entities/user.entity';

@InputType()
export class ResendOtpDto {
	@Field(() => Int)
	@IsNotEmpty()
	@Validate(IsExist, [User, 'id'], {
		message: 'User Not Exists',
	})
	userId: number;
}
