import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { employeeSkillController } from './employeeSkill.controller';
import { employeeSkillService } from './employeeSkill.service';
import { employeeSkillQueriesService } from './employeeSkillQueries.service'; 
import { Tenant } from '../tenant/tenant.entity';
import { SkillsQueriesService } from './../Skills/skillsQueries.service';
import {EmployeeQueriesService} from "./../user/employeeQueries.service" 
import {CompetencyService} from "./../competency/competency.service"
import {CompetencyQueriesService} from "./../competency/competencyQueries.service" 



@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [employeeSkillController],
  providers: [employeeSkillService, employeeSkillQueriesService,SkillsQueriesService, EmployeeQueriesService, CompetencyService, CompetencyQueriesService] 
})
export class employeeSkillModule {}