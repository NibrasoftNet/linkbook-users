import { AuthGoogleResolver } from './auth-google.resolver';
import { AuthGoogleService } from './auth-google.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
	imports: [ConfigModule, AuthModule],
	providers: [AuthGoogleResolver, AuthGoogleService],
	exports: [AuthGoogleService],
})
export class AuthGoogleModule {}
