import { Field, ID, InputType } from '@nestjs/graphql';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsStrongPassword,
	Validate,
} from 'class-validator';
import {
	IsExist,
	IsNotExist,
	lowerCaseTransformer,
} from '@NibrasoftNet/linkbook-commons';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { Transform } from 'class-transformer';
import { User } from '../entities/user.entity';

// Register the Role and Status entities as GraphQL types
// registerEnumType(Role, { name: 'Role' });
// registerEnumType(Status, { name: 'Status' });

@InputType() // Decorate with @InputType() for GraphQL input
export class CreateUserDto {
	@Field(() => String)
	@Transform(lowerCaseTransformer)
	@IsNotEmpty()
	@Validate(IsNotExist, [User, 'email'], {
		message: 'Email Already Exists',
	})
	@IsEmail()
	email: string;

	@Field(() => String)
	@IsStrongPassword({
		minLength: 10,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
		minUppercase: 1,
	})
	@IsNotEmpty()
	password?: string;

	@Field(() => String)
	@IsNotEmpty()
	@Validate(IsNotExist, [User, 'phone'], {
		message: 'Phone Number Already Exists',
	})
	phone: string;

	@Field(() => String, { nullable: true })
	provider?: string;

	@Field(() => String, { nullable: true })
	socialId?: string | null;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	lastName: string;

	@Field(() => ID, { nullable: true })
	@Validate(IsNotExist, [Role, 'id'], {
		message: 'Role Not Exists',
	})
	role?: Role | null;

	@Field(() => ID, { nullable: true })
	@Validate(IsNotExist, [Status, 'id'], {
		message: 'Status Not Exists',
	})
	status?: Status;

	@Field(() => String, { nullable: true })
	hash?: string | null;
}
