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
  NotFoundException,
} from '@nestjs/common';
import { employeeSkillService } from './competencySkill.service';
import {
  getSkillsByCompetencySwagger,
  getSkillsByLevelSwagger,
  getSkillsBySkillNameSwagger,
} from './competencySkill.swagger';
import {
  EmployeeSkillNameDto,
  EmployeeBySkillDto,
  EmployeeByLevelDto,
  EmployeeByStudioDto,
} from './competencySKill.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('competencySkill')
export class employeeSkillController {
  constructor(private readonly employeeSkillService: employeeSkillService) {}

  @Get(':skill_name')
  @getSkillsBySkillNameSwagger()
  async getSkillsBySkillName(
    @Param('skill_name') skill_name: string,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const employeeSkillData = plainToClass(EmployeeBySkillDto, { skill_name });
    const errors = await validate(employeeSkillData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.employeeSkillService.getSkillsBySkillName(
      skill_name,
      tenantCode,
    );
  }

  @Get(':skill_name/:level')
  @getSkillsByLevelSwagger()
  async getSkillsByLevel(
    @Param('skill_name') skill_name: string,
    @Param('level') level: string,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const employeeSkillData = plainToClass(EmployeeByLevelDto, {
      skill_name,
      level,
    });
    const errors = await validate(employeeSkillData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.employeeSkillService.getSkillsByLevel(
      skill_name,
      level,
      tenantCode,
    );
  }

  @Post(':studio_id')
  @getSkillsByCompetencySwagger()
  async getSkillsByCompetency(
    @Body('studio_id') studio_id: string,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const employeeSkillData = plainToClass(EmployeeByStudioDto, {
      studio_id,
    });
    const errors = await validate(employeeSkillData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.employeeSkillService.getSkillsByCompetency(
      studio_id,
      tenantCode,
    );
  }
}
