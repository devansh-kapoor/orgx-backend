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
import { CompetencyService } from './competency.service';
import {
  createCompetencySwagger,
  competencyNameSwagger,
  getAllCompetenciesSwagger,
  getCompetencyByIdSwagger,
  updateCompetencySwagger,
  deleteCompetencySwagger,
} from './competency.swagger';
import {
  CreateCompetencyDto,
  CompetencyNameDto,
  UpdateCompetencyDto,
  CompetencyIdDto,
} from './competency.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('competency')
export class CompetencyController {
  constructor(private readonly competencyService: CompetencyService) {}

  @Post()
  @createCompetencySwagger()
  async createCompetency(
    @Request() req,
    @Body() userData: CreateCompetencyDto,
  ) {
    const tenantCode = req.headers.tenant_code;
    const competencyData = plainToClass(CreateCompetencyDto, userData);
    const errors = await validate(competencyData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.competencyService.createCompetency(tenantCode, userData);
  }

  @Post('competencyName')
  @competencyNameSwagger()
  async competencyName(@Request() req, @Body() data: CompetencyNameDto) {
    const tenantCode = req.headers.tenant_code;
    const competencyData = plainToClass(CompetencyNameDto, data);
    const errors = await validate(competencyData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.competencyService.competencyName(tenantCode, data);
  }

  @Get()
  @getAllCompetenciesSwagger()
  async getAllCompetencies(@Request() req) {
    const tenantCode = req.headers.tenant_code;
    return await this.competencyService.getAllCompetencies(tenantCode);
  }

  @Get(':id')
  @getCompetencyByIdSwagger()
  async getCompetencyById(@Param('id') id: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const competencyIdDto = plainToClass(CompetencyIdDto, { id });
    const errors = await validate(competencyIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.competencyService.getCompetencyById(id, tenantCode);
  }

  @Put(':id')
  @updateCompetencySwagger()
  async updateCompetency(
    @Param('id') id: string,
    @Body() compentencyData: UpdateCompetencyDto,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const competencyData = plainToClass(UpdateCompetencyDto, compentencyData);
    const errors = await validate(competencyData);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.competencyService.updateCompetency(
      id,
      tenantCode,
      compentencyData,
    );
  }

  @Delete(':id')
  @deleteCompetencySwagger()
  async deleteCompetency(@Param('id') id: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const competencyIdDto = plainToClass(CompetencyIdDto, { id });
    const errors = await validate(competencyIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.competencyService.deleteCompetency(id, tenantCode);
  }
}
