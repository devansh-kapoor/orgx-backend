import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillController } from './skills.controller';
import { SkillService } from './skills.service';
import { SkillsQueriesService } from './skillsQueries.service'; // Add this line
import { Tenant } from '../tenant/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [SkillController],
  providers: [SkillService, SkillsQueriesService] 
})
export class SkillModule {}
