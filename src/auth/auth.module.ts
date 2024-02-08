import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileModule } from '../file/file.module';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { OtpModule } from '../otp/otp.module';
import { SessionModule } from '../session/session.module';
import { UsersModule } from '../users/users.module';
import { join } from 'path';

@Module({
	imports: [
		UsersModule,
		SessionModule,
		OtpModule,
		FileModule,
		JwtModule.register({}),
		ClientsModule.register([
			{
				name: 'USER_SERVICE',
				transport: Transport.GRPC,
				options: {
					package: 'shared',
					protoPath: join(__dirname, '../../proto/shared.proto'),
					url: 'localhost:50051',
				},
			},
		]),
	],
	providers: [
		AuthResolver,
		AuthService,
		IsExist,
		IsNotExist,
		JwtStrategy,
		JwtRefreshStrategy,
		AnonymousStrategy,
	],
	exports: [AuthService],
})
export class AuthModule {}
