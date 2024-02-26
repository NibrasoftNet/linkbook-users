import { CategoryCommunityModule } from '../category-community/category-community.module';
import { Community } from './entities/community.entity';
import { CommunityResolver } from './community.resolver';
import { CommunityService } from './community.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersFileModule } from '../file/users-file.module';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Community]),
		CategoryCommunityModule,
		UsersModule,
		UsersFileModule,
	],
	providers: [CommunityResolver, CommunityService],
})
export class CommunityModule {}
