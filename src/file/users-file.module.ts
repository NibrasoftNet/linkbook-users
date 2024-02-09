import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersFileEntity } from './entities/users-file.entity';
import { UsersFileService } from './users-file.service';

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UsersFileEntity])],
	providers: [UsersFileService],
	exports: [UsersFileService],
})
export class UsersFileModule {}
