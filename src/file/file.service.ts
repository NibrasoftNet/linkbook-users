import { CreateFileDto } from './dto/create-file.dto';
import { FileEntity } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FileService {
	constructor(
		@InjectRepository(FileEntity)
		private readonly fileRepository: Repository<FileEntity>,
	) {}

	async create(createFileDto: CreateFileDto): Promise<FileEntity> {
		const newFile = this.fileRepository.create(createFileDto);
		return this.fileRepository.save(newFile);
	}

	@Transactional()
	async createMany(paths: string[]): Promise<FileEntity[]> {
		const newFiles = paths.map((path) =>
			this.fileRepository.create(new CreateFileDto(path)),
		);
		return this.fileRepository.save(newFiles);
	}

	async update(updateFileDto: UpdateFileDto): Promise<FileEntity> {
		const file = await this.fileRepository.findOneOrFail({
			where: {
				id: updateFileDto.id,
			},
		});

		Object.assign(file, updateFileDto);
		return this.fileRepository.save(file);
	}
}
