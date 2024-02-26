import { AccessAuthGuard } from '../utils/guards/auth/access-auth.guard';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Community } from './entities/community.entity';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import {
	CurrentUser,
	JwtPayloadType,
	RoleEnum,
} from '@NibrasoftNet/linkbook-commons';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Community)
export class CommunityResolver {
	constructor(private readonly communityService: CommunityService) {}

	@UseGuards(AccessAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER, RoleEnum.ADMIN)
	@Mutation(() => Community, { name: 'createCommunity' })
	async createCommunity(
		@CurrentUser() user: JwtPayloadType,
		@Args('createCommunityDto') createCommunityDto: CreateCommunityDto,
	) {
		// eslint-disable-next-line no-param-reassign
		createCommunityDto.creatorId = user.id;
		return this.communityService.create(createCommunityDto);
	}

	@Query(() => [Community], { name: 'community' })
	findAll() {
		return this.communityService.findAll();
	}

	@Query(() => Community, { name: 'community' })
	findOne(@Args('id', { type: () => Int }) id: number) {
		return this.communityService.findOne(id);
	}

	@Mutation(() => Community)
	updateCommunity(
		@Args('updateCommunityInput') updateCommunityInput: UpdateCommunityDto,
	) {
		return this.communityService.update(
			updateCommunityInput.id,
			updateCommunityInput,
		);
	}

	@Mutation(() => Community)
	removeCommunity(@Args('id', { type: () => Int }) id: number) {
		return this.communityService.remove(id);
	}
}
