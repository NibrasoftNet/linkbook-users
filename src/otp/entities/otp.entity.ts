import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import * as bcrypt from 'bcryptjs';

@Entity()
@ObjectType()
export class OTP {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar' })
  @Field(() => String)
  otp: string;

  @Column({ type: 'bigint' }) // Use bigint for Unix Timestamp (milliseconds)
  @Field(() => Float)
  expiryDate: number;

  @Column({ type: 'int' })
  @Field(() => Int)
  userId: number;

  @BeforeInsert()
  @BeforeUpdate()
  async setOtp() {
      const salt = await bcrypt.genSalt();
      this.otp = await bcrypt.hash(this.otp, salt);
  }
}