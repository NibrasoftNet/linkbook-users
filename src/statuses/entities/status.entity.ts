import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Allow } from 'class-validator';
import { EntityHelper } from '../../utils/entities/entity-helper';

@ObjectType()
@Entity()
export class Status  {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name?: string;
}

