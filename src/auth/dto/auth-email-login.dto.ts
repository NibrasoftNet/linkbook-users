import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@NibrasoftNet/linkbook-commons';

@InputType()
export class AuthEmailLoginDto {
  @Field(() => String)
  @Transform(lowerCaseTransformer)
  @Validate(IsExist, ['User', 'email'], {
    message: 'Email Not Exists',
  })
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;
}

