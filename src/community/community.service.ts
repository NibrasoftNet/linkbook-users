import { CategoryCommunityService } from '../category-community/category-community.service';
import { Community } from './entities/community.entity';
import { CreateCommunityDto } from './dto/create-community.dto';
import { CreateUsersFileDto } from '../file/dto/create-users-file.dto';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { UsersFileService } from '../file/users-file.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommunityService {
	constructor(
		@InjectRepository(Community)
		private readonly communityRepository: Repository<Community>,
		private readonly userService: UsersService,
		private readonly categoryCommunityService: CategoryCommunityService,
		private readonly usersFileService: UsersFileService,
	) {}

	async create(createCommunityDto: CreateCommunityDto) {
		const community = this.communityRepository.create(
			createCommunityDto as DeepPartial<Community>,
		);
		community.category = await this.categoryCommunityService.findOneOrFail({
			id: createCommunityDto.categoryId,
		});
		community.members = [
			await this.userService.findOne({
				id: createCommunityDto.creatorId,
			}),
		];
		if (createCommunityDto.image) {
			const imageObject = new CreateUsersFileDto(
				createCommunityDto.image,
			);
			community.image = await this.usersFileService.create(imageObject);
		}
		return this.communityRepository.save(community);
	}

	findAll() {
		return `This action returns all community`;
	}

	findOne(id: number) {
		return `This action returns a #${id} community`;
	}

	update(id: number, updateCommunityInput: UpdateCommunityDto) {
		return `This action updates a #${id} community`;
	}

	remove(id: number) {
		return `This action removes a #${id} community`;
	}
}
