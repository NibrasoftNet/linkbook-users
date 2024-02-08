import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Allow, IsNumber } from 'class-validator';
import { EntityHelper } from '../../utils/entities/entity-helper';

@ObjectType()
@Entity()
export class Role {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	@IsNumber()
	id: number;

	@Field(() => String)
	@Column()
	name?: string;
}
