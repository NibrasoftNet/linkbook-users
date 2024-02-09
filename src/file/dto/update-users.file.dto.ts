import { CreateUsersFileDto } from './create-users-file.dto';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUsersFileDto extends PartialType(CreateUsersFileDto) {
	@Field(() => ID)
	id: string;
}
