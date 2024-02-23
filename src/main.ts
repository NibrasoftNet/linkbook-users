import { AllConfigType } from './config/config.type';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
	StorageDriver,
	initializeTransactionalContext,
} from 'typeorm-transactional';
import { useContainer } from 'class-validator';
import validationOptions from './utils/validation-options';

const logger = new Logger('LinkBook Users');
async function bootstrap() {
	initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
	const app = await NestFactory.create(AppModule, { cors: true });
	useContainer(app.select(AppModule), {
		fallbackOnErrors: true,
	});
	const configService = app.get(ConfigService<AllConfigType>);
	app.enableShutdownHooks();
	app.setGlobalPrefix(
		configService.getOrThrow('app.apiPrefix', { infer: true }),
		{
			exclude: ['/'],
		},
	);
	// app.useGlobalInterceptors(new ResponseInterceptor());
	app.useGlobalPipes(new ValidationPipe(validationOptions));
	await app.listen(
		configService.getOrThrow('app.port', { infer: true }),
		() => {
			logger.log(
				`LinkBook Users is listening to port ${configService.getOrThrow(
					'app.port',
					{ infer: true },
				)}...`,
			);
		},
	);
}
void bootstrap().catch((e) => {
	logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap');
	throw e;
});
