import {
	ApolloFederationDriver,
	ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { OtpModule } from './otp/otp.module';
import { PassportModule } from '@nestjs/passport';
import { SessionModule } from './session/session.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import appConfig from './config/app.config';
import authConfig from './auth/config/auth.config';
import databaseConfig from './database/config/database.config';
import googleConfig from './auth-google/config/google.config';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig, authConfig, googleConfig, databaseConfig],
			envFilePath: ['.env'],
		}),
		GraphQLModule.forRoot<ApolloFederationDriverConfig>({
			driver: ApolloFederationDriver,
			playground: true,
			// plugins:[ ApolloServerPluginLandingPageLocalDefault() ],
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
		AuthGoogleModule,
	],
	controllers: [],
	providers: [JwtStrategy],
})
export class AppModule {}
