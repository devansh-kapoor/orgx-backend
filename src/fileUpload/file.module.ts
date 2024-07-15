import { Module } from '@nestjs/common';
import { FilesController } from './file.controller';
import {UserService} from "./../user/user.service"
import { TypeOrmModule } from '@nestjs/typeorm';
import Tenant from 'src/tenant/tenant.entity';
import { EmployeeQueriesService } from 'src/user/employeeQueries.service';
import {CompetencyService} from "./../competency/competency.service"
import {CompetencyQueriesService} from "./../competency/competencyQueries.service"
import { fileQueriesService } from './fileQueries.service';
import { fileService } from './file.services';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
    controllers: [FilesController],
    providers: [UserService, EmployeeQueriesService, CompetencyQueriesService, CompetencyService, fileQueriesService, fileService], // Add CompetencyQueriesService here
  })
export class FileModule {}
