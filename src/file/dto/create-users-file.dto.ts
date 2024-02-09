import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateUsersFileDto {
	@Field(() => String)
	@IsString()
	path: string;

	constructor(path: string) {
		this.path = path;
	}
}
