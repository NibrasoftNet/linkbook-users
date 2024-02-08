import { CreateFileDto } from './create-file.dto';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFileDto extends PartialType(CreateFileDto) {
	@Field(() => ID)
	id: string;
}
