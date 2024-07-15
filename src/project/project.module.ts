import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectQueriesService } from './projectQueries.service'; // Add this line
import { Tenant } from '../tenant/tenant.entity';
import {UserService} from "../user/user.service"
import { EmployeeQueriesService } from '../user/employeeQueries.service';
import {CompetencyQueriesService} from "../competency/competencyQueries.service"

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectQueriesService, UserService, EmployeeQueriesService,CompetencyQueriesService], 
})
export class ProjectModule {}
