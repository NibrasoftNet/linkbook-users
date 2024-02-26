import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsUrl } from 'class-validator';

@InputType()
export class CreateCommunityDto {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsNumber()
	creatorId?: number;

	@Field(() => String)
	@IsNotEmpty()
	name: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	description?: string;

	@Field(() => Int)
	@IsNotEmpty()
	@IsNumber()
	categoryId: number;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsNumber()
	userId?: number;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsUrl()
	image?: string;
}
