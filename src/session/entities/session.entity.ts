import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	DeleteDateColumn,
	ManyToOne,
	Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity()
export class Session {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => User)
	@ManyToOne(() => User, {
		eager: true,
	})
	@Index()
	user: User;

	@Field(() => Date)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => Date, { nullable: true })
	@DeleteDateColumn()
	deletedAt?: Date;
}
