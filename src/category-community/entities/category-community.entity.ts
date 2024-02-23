import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle
import { Community } from '../../community/entities/community.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CategoryCommunity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => String)
	@Column()
	name: string;

	@Field(() => String)
	@Column()
	description: string;

	@Field(() => [Community], { nullable: true })
	@OneToMany(() => Community, (community) => community.category, {
		nullable: true,
	})
	communities?: Community[];
}
