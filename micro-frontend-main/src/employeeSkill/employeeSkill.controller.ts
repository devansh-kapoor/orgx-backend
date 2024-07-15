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
import { employeeSkillService } from './employeeSkill.service';
import {
  createEmployeeSkillSwagger,
  checkEmployeeSkillByNameSwagger,
  getAllEmployeeSkillsSwagger,
  getEmployeeSkillByEmployeeIdSwagger,
  deleteEmployeeSkillSwagger,
} from './employeeSkill.swagger';
import {
  CreateEmployeeSkillDto,
  EmployeeSkillNameDto,
  EmployeeSkillIdDto,
  DeleteEmployeeSkillDto,
  EmployeeBySkillDto,
  EmployeeByLevelDto,
} from './employeeSKill.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('employeeSkill')
export class employeeSkillController {
  constructor(private readonly employeeSkillService: employeeSkillService) {}

  @Post()
  @createEmployeeSkillSwagger()
  async createEmployeeSkill(
    @Request() req,
    @Body() userData: CreateEmployeeSkillDto,
  ) {
    const tenantCode = req.headers.tenant_code;
    const employeeSkillData = plainToClass(CreateEmployeeSkillDto, userData);
    const errors = await validate(employeeSkillData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.employeeSkillService.createEmployeeSkill(
      tenantCode,
      userData,
    );
  }

  // @Post('employeeSkillName')
  // @checkEmployeeSkillByNameSwagger()
  // async employeeSkillName(@Request() req, @Body() data: EmployeeSkillNameDto) {
  //   const tenantCode = req.headers.tenant_code;
  //   const employeeSkillData = plainToClass(EmployeeSkillNameDto, data);
  //   const errors = await validate(employeeSkillData);
  //   if (errors.length > 0) {
  //     const errorMessage = Object.values(errors[0].constraints).join(', ');
  //     throw new BadRequestException({ message: errorMessage });
  //   }
  //   return await this.employeeSkillService.checkEmployeeSkillByName(
  //     tenantCode,
  //     data,
  //   );
  // }

  @Get()
  @getAllEmployeeSkillsSwagger()
  async getAllEmployeeSkill(@Request() req) {
    const tenantCode = req.headers.tenant_code;
    return await this.employeeSkillService.getAllEmployeeSkills(tenantCode);
  }

  @Get(':employee_id')
  @getEmployeeSkillByEmployeeIdSwagger()
  async getEmployeeSkillByEmployeeId(
    @Param('employee_id') employee_id: string,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const employeeSkillIdDto = plainToClass(EmployeeSkillIdDto, {
      employee_id,
    });
    const errors = await validate(employeeSkillIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }

    return await this.employeeSkillService.getEmployeeSkillByEmployeeId(
      employee_id,
      tenantCode,
    );
  }

  

  @Delete(':id')
  @deleteEmployeeSkillSwagger()
  async deleteEmployeeSkill(
    @Param('id') id: string,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const employeeSkillIdDto = plainToClass(DeleteEmployeeSkillDto, {
      id,
      
    });
    const errors = await validate(employeeSkillIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.employeeSkillService.deleteEmployeeSkill(
      id,
      tenantCode,
    );
  }



}
