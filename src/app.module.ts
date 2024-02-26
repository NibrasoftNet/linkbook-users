import { AnonymousStrategy } from './auth/strategies/anonymous.strategy';
import {
	ApolloFederationDriver,
	ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { AuthModule } from './auth/auth.module';
import { CategoryCommunityModule } from './category-community/category-community.module';
import { CommunityModule } from './community/community.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { IResponseError } from './utils/exceptions/response.error.interface';
import { JwtRefreshStrategy } from './auth/strategies/jwt-refresh.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { OtpModule } from './otp/otp.module';
import { PassportModule } from '@nestjs/passport';
import { SessionModule } from './session/session.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersFileModule } from './file/users-file.module';
import { UsersModule } from './users/users.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import appConfig from './config/app.config';
import authConfig from './auth/config/auth.config';
import databaseConfig from './database/config/database.config';
import googleConfig from './auth-google/config/google.config';
import { CommonModule } from '@NibrasoftNet/linkbook-commons';

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
			playground: false,
			plugins: [ApolloServerPluginLandingPageLocalDefault()],
			autoSchemaFile: {
				federation: 2,
			},
			formatError: (error) => {
				const originalError = error.extensions
					?.originalError as IResponseError;
				if (!originalError) {
					return {
						message: error.message,
						code: error.extensions?.code,
						timestamp: new Date().toISOString(),
					};
				}
				return {
					statusCode: originalError.statusCode,
					message: originalError.message,
					code: originalError?.error || error.extensions?.code,
					timestamp: new Date().toISOString(),
					path: error.path,
				};
			},
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigService,
			dataSourceFactory: async (options: DataSourceOptions) => {
				return addTransactionalDataSource(new DataSource(options));
			},
		}),
		CommonModule,
		PassportModule,
		AuthModule,
		UsersModule,
		SessionModule,
		OtpModule,
		AuthGoogleModule,
		UsersFileModule,
		CommunityModule,
		CategoryCommunityModule,
	],
	controllers: [],
	providers: [JwtStrategy, JwtRefreshStrategy, AnonymousStrategy],
})
export class AppModule {}
