import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { SessionModule } from '../session/session.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { OtpModule } from '../otp/otp.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    OtpModule,
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
      } ,
    ]),
  ],
  providers: [
    AuthResolver,
    AuthService,
    IsExist,
    IsNotExist,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy
  ],
  exports: [AuthService]
})
export class AuthModule {}
