import { Field, Int, InputType, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';


@InputType()
export class ResendOtpDto {
	@Field(() => Int)
	@IsNotEmpty()
	@Validate(IsExist, ['User', 'id'], {
		message: 'User Not Exists',
	})
	userId: number;
}