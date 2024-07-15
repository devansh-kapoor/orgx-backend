import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  createProjectSwagger,
  //   competencyNameSwagger,
  getAllProjectsSwagger,
  getProjectByIdSwagger,
  updateProjectSwagger,
  deleteProjectSwagger,
} from './project.swagger';
import {
  CreateProjectDto,
  ProjectNameDto,
  UpdateProjectDto,
  ProjectIdDto,
} from './project.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @createProjectSwagger()
  async createProject(@Request() req, @Body() userData: CreateProjectDto) {
    const tenantCode = req.headers.tenant_code;
    const projectData = plainToClass(CreateProjectDto, userData);
    const errors = await validate(projectData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.projectService.createProject(tenantCode, userData);
  }

  @Get()
  @getAllProjectsSwagger()
  async getAllProjects(@Request() req) {
    const tenantCode = req.headers.tenant_code;
    return await this.projectService.getAllProjects(tenantCode);
  }

  @Get(':id')
  @getProjectByIdSwagger()
  async getProjectById(@Param('id') id: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const competencyIdDto = plainToClass(ProjectIdDto, { id });
    const errors = await validate(ProjectIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.projectService.getProjectById(id, tenantCode);
  }

  @Put(':id')
  @updateProjectSwagger()
  async updateCompetency(
    @Param('id') id: string,
    @Body() projectData: UpdateProjectDto,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const competencyData = plainToClass(UpdateProjectDto, projectData);
    const errors = await validate(competencyData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.projectService.updateProject(id, tenantCode, projectData);
  }

  @Delete(':id')
  @deleteProjectSwagger()
  async deleteCompetency(@Param('id') id: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const competencyIdDto = plainToClass(ProjectIdDto, { id });
    const errors = await validate(ProjectIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.projectService.deleteProject(id, tenantCode);
  }
}
