import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryCommunity } from './entities/category-community.entity';
import { CategoryCommunityService } from './category-community.service';
import { CreateCategoryCommunityDto } from './dto/create-category-community.dto';
import { UpdateCategoryCommunityDto } from './dto/update-category-community.dto';

@Resolver(() => CategoryCommunity)
export class CategoryCommunityResolver {
	constructor(
		private readonly categoryCommunityService: CategoryCommunityService,
	) {}

	@Mutation(() => CategoryCommunity, { name: 'createCategoryCommunity' })
	async createCategoryCommunity(
		@Args('createCategoryCommunityInput')
		createCategoryCommunityInput: CreateCategoryCommunityDto,
	): Promise<CategoryCommunity> {
		return this.categoryCommunityService.create(
			createCategoryCommunityInput,
		);
	}

	@Query(() => [CategoryCommunity], { name: 'findAllCategoryCommunity' })
	async findAll() {
		return this.categoryCommunityService.findAll();
	}

	@Query(() => CategoryCommunity, { name: 'findOneCategoryCommunity' })
	async findOne(
		@Args('id', { type: () => Int }) id: number,
	): Promise<CategoryCommunity> {
		return this.categoryCommunityService.findOne({ id });
	}

	@Mutation(() => CategoryCommunity, { name: 'updateCategoryCommunity' })
	async updateCategoryCommunity(
		@Args('updateCategoryCommunityDto')
		updateCategoryCommunityDto: UpdateCategoryCommunityDto,
	): Promise<CategoryCommunity> {
		return this.categoryCommunityService.update(updateCategoryCommunityDto);
	}

	@Mutation(() => CategoryCommunity, { name: 'deleteCategoryCommunity' })
	async removeCategoryCommunity(@Args('id', { type: () => Int }) id: number) {
		return this.categoryCommunityService.remove(+id);
	}
}
