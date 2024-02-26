import { CategoryCommunity } from './entities/category-community.entity';
import { CategoryCommunityResolver } from './category-community.resolver';
import { CategoryCommunityService } from './category-community.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([CategoryCommunity])],
	providers: [CategoryCommunityResolver, CategoryCommunityService],
	exports: [CategoryCommunityService],
})
export class CategoryCommunityModule {}
