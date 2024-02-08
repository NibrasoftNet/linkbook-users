import { CreateOTPDto } from './create-otp.dto';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOtpDto extends PartialType(CreateOTPDto) {}
