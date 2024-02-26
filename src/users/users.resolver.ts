import {
	Args,
	Int,
	Mutation,
	Query,
	ResolveReference,
	Resolver,
} from '@nestjs/graphql';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Resolver(() => User)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Mutation(() => User)
	createUser(@Args('createUserDto') createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Query(() => [User], { name: 'users' })
	findAll() {
		return this.usersService.findAll();
	}

	@Query(() => User, { name: 'user' })
	findOne(@Args('id', { type: () => Int }) id: number) {
		return this.usersService.findOne({ id });
	}

	@Mutation(() => User)
	updateUser(@Args('updateUserDto') updateUserDto: UpdateUserDto) {
		return this.usersService.update(updateUserDto.id, updateUserDto);
	}

	@Mutation(() => User)
	removeUser(@Args('id', { type: () => Int }) id: number) {
		return this.usersService.remove(id);
	}

	@ResolveReference()
	resolveReference(reference: {
		__typename: string;
		id: number;
	}): Promise<User> {
		return this.usersService.findOne({ id: reference.id });
	}
}
