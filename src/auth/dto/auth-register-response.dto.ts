import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthRegisterResponseDto {
	@Field(() => Int)
	userId: number;

	@Field(() => Float)
	expiryDate: number;

	constructor(userId: number, expiryDate: number) {
		this.userId = userId;
		this.expiryDate = expiryDate;
	}
}
