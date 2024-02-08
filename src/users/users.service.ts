import { CreateUserDto } from './dto/create-user.dto';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { NullableType } from '@NibrasoftNet/linkbook-commons';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async create(createProfileDto: CreateUserDto): Promise<User> {
		const user = this.usersRepository.create(createProfileDto);
		return this.usersRepository.save(user);
	}

	async findOne(
		fields: FindOptionsWhere<User>,
		relations?: FindOptionsRelations<User>,
	): Promise<NullableType<User>> {
		return this.usersRepository.findOne({
			where: fields,
			relations,
		});
	}

	findAll() {
		return this.usersRepository.find();
	}

	update(id: number, updateUserInput: UpdateUserInput) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
