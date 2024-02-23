import { CategoryCommunity } from './entities/category-community.entity';
import { CreateCategoryCommunityDto } from './dto/create-category-community.dto';
import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsWhere,
	Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UpdateCategoryCommunityDto } from './dto/update-category-community.dto';

@Injectable()
export class CategoryCommunityService {
	constructor(
		@InjectRepository(CategoryCommunity)
		private categoryCommunityRepository: Repository<CategoryCommunity>,
	) {}

	async create(createCategoryCommunityDto: CreateCategoryCommunityDto) {
		const categoryCommunity = this.categoryCommunityRepository.create(
			createCategoryCommunityDto as DeepPartial<CategoryCommunity>,
		);
		return this.categoryCommunityRepository.save(categoryCommunity);
	}

	async findAll() {
		return this.categoryCommunityRepository.find();
	}

	async findOne(
		fields: FindOptionsWhere<CategoryCommunity>,
		relations?: FindOptionsRelations<CategoryCommunity>,
	): Promise<CategoryCommunity> {
		return this.categoryCommunityRepository.findOne({
			where: fields,
			relations,
		});
	}

	async findOneOrFail(
		fields: FindOptionsWhere<CategoryCommunity>,
		relations?: FindOptionsRelations<CategoryCommunity>,
	): Promise<CategoryCommunity> {
		return this.categoryCommunityRepository.findOneOrFail({
			where: fields,
			relations,
		});
	}

	async update(
		updateCategoryCommunityDto: UpdateCategoryCommunityDto,
	): Promise<CategoryCommunity> {
		const communityCategory = await this.findOneOrFail({
			id: updateCategoryCommunityDto.id,
		});
		Object.assign(communityCategory, UpdateCategoryCommunityDto);
		return this.categoryCommunityRepository.save(communityCategory);
	}

	async remove(id: number) {
		return this.categoryCommunityRepository.delete(id);
	}
}
