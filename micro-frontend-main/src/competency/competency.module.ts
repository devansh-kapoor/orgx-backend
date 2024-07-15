import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetencyController } from './competency.controller';
import { CompetencyService } from './competency.service';
import { CompetencyQueriesService } from './competencyQueries.service'; // Add this line
import { Tenant } from '../tenant/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [CompetencyController],
  providers: [CompetencyService, CompetencyQueriesService], // Add CompetencyQueriesService here
})
export class CompetencyModule {}
