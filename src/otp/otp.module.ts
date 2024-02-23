import { Module } from '@nestjs/common';
import { OTP } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([OTP])],
	providers: [OtpService],
	exports: [OtpService],
})
export class OtpModule {}
