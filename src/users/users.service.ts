import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '@NibrasoftNet/linkbook-commons';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createProfileDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createProfileDto);
    return await this.usersRepository.save(user);
  }

  async findOne(fields: FindOptionsWhere<User>, relations?: FindOptionsRelations<User>): Promise<NullableType<User>> {
    return this.usersRepository.findOne({
      where: fields,
      relations: relations
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
