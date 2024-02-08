import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleResolver } from './auth-google.resolver';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule, AuthModule],
	providers: [AuthGoogleResolver, AuthGoogleService],
	exports: [AuthGoogleService],
})
export class AuthGoogleModule {}
