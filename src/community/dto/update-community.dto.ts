import { CreateCommunityDto } from './create-community.dto';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCommunityDto extends PartialType(CreateCommunityDto) {
	@Field(() => Int)
	id: number;
}
