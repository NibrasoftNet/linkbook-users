import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCategoryCommunityDto {
	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	name: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	description?: string;
}
