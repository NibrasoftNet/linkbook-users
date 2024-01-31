import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import authConfig from './auth/config/auth.config';
import appConfig from "./config/app.config";
import databaseConfig from "./database/config/database.config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmConfigService} from "./database/typeorm-config.service";
import { DataSource, DataSourceOptions } from 'typeorm';
import {GraphQLModule} from "@nestjs/graphql";
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { UsersModule } from './users/users.module';
import { SessionModule } from './session/session.module';
import { OtpModule } from './otp/otp.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/strategies/jwt.strategy';


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig], //, mailConfig, fileConfig
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    PassportModule,
    AuthModule,
    UsersModule,
    SessionModule,
    OtpModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
