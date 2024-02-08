import { FileEntity } from './entities/file.entity';
import { FileService } from './file.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([FileEntity])],
	providers: [FileService],
	exports: [FileService],
})
export class FileModule {}
