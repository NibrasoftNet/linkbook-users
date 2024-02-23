import { CreateCategoryCommunityDto } from './create-category-community.dto';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryCommunityDto extends PartialType(
	CreateCategoryCommunityDto,
) {
	@Field(() => Int)
	id: number;
}
