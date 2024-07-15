import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Tenant } from '../tenant/tenant.entity';
import { EmployeeQueriesService } from './employeeQueries.service';
import {CompetencyService} from "./../competency/competency.service"
import {CompetencyQueriesService} from "./../competency/competencyQueries.service"

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [UserController],
  providers: [UserService, EmployeeQueriesService, CompetencyService, CompetencyQueriesService],
})
export class UserModule {}
