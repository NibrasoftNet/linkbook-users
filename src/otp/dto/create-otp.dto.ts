import { Field, Int, InputType, Float } from '@nestjs/graphql';

@InputType()
export class CreateOTPDto {
	@Field(() => String)
	otp: string;

	@Field(() => Int)
	userId: number;

	@Field(() => Float)
	expiryDate: number;

	constructor(otp: string, userId: number, expiryDate: number) {
		this.otp = otp;
		this.userId = userId;
		this.expiryDate = expiryDate;
	}
}
