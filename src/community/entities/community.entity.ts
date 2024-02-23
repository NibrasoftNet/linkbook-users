// eslint-disable-next-line import/no-cycle
import { CategoryCommunity } from '../../category-community/entities/category-community.entity';
import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
// eslint-disable-next-line import/no-cycle
import { User } from '../../users/entities/user.entity';
import { UsersFileEntity } from '../../file/entities/users-file.entity';

@ObjectType()
@Entity()
export class Community {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column()
	name: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	description: string;

	@Field(() => UsersFileEntity, { nullable: true })
	@OneToOne(() => UsersFileEntity, (file) => file, {
		eager: true,
		nullable: true,
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	image?: UsersFileEntity;

	@Field(() => [User], { nullable: true })
	@ManyToMany(() => User, (user) => user.communities, { nullable: true })
	@JoinTable()
	members?: User[];

	@Field(() => CategoryCommunity)
	@ManyToOne(() => CategoryCommunity, (category) => category.communities)
	category: CategoryCommunity;
}
