import { CreateUsersFileDto } from './dto/create-users-file.dto';
import { UsersFileEntity } from './entities/users-file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { UpdateUsersFileDto } from './dto/update-users.file.dto';

@Injectable()
export class UsersFileService {
	constructor(
		@InjectRepository(UsersFileEntity)
		private readonly fileRepository: Repository<UsersFileEntity>,
	) {}

	async create(createFileDto: CreateUsersFileDto): Promise<UsersFileEntity> {
		const newFile = this.fileRepository.create(createFileDto);
		return this.fileRepository.save(newFile);
	}

	@Transactional()
	async createMany(paths: string[]): Promise<UsersFileEntity[]> {
		const newFiles = paths.map((path) =>
			this.fileRepository.create(new CreateUsersFileDto(path)),
		);
		return this.fileRepository.save(newFiles);
	}

	async update(updateFileDto: UpdateUsersFileDto): Promise<UsersFileEntity> {
		const file = await this.fileRepository.findOneOrFail({
			where: {
				id: updateFileDto.id,
			},
		});

		Object.assign(file, updateFileDto);
		return this.fileRepository.save(file);
	}
}
