import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { PracticeQueriesService } from './practiceQueries.service';
import { Tenant } from '../tenant/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [PracticeController],
  providers: [PracticeService, PracticeQueriesService],
})
export class PracticeModule {}
