import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class UsersFileEntity {
	@Field(() => ID, { description: 'Unique identifier' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field(() => String)
	@Column()
	path: string;
}
