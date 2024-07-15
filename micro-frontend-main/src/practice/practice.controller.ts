import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Param,
  Put,
  Delete,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { PracticeService } from './practice.service';
import {
  createPracticeSwagger,
  getPracticeSwagger,
  getPracticeByIdSwagger,
  updatePracticeSwagger,
  deletePracticeSwagger,
  practiceNameSwagger,
} from './paractice.swagger';
import {
  CreatePracticeDto,
  PracticeNameDto,
  UpdatePracticeDto,
  PracticeGetIdDto,
  PracticeDeleteIdDto,
} from './practice.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  @createPracticeSwagger()
  async createPractice(
    @Request() req,
    @Body() practiceData: CreatePracticeDto,
  ) {
    const tenantName = req.headers.tenant_code;
    const practiceDto = plainToClass(CreatePracticeDto, practiceData);
    const errors = await validate(practiceDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.practiceService.createPractice(tenantName, practiceDto);
  }

  @Post('practiceName')
  @practiceNameSwagger()
  async practiceName(@Request() req, @Body() data: PracticeNameDto) {
    const tenantName = req.headers.tenant_code;
    const practiceNameDto = plainToClass(PracticeNameDto, data);
    const errors = await validate(practiceNameDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.practiceService.practiceName(tenantName, practiceNameDto);
  }

  @Get()
  @getPracticeSwagger()
  async getAllPractices(@Request() req) {
    const tenantName = req.headers.tenant_code;
    return await this.practiceService.getAllPractices(tenantName);
  }

  @Get(':id')
  @getPracticeByIdSwagger()
  async getPracticeById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const tenantName = req.headers.tenant_code;
    const getIdDto = plainToClass(PracticeGetIdDto, { id });
    const errors = await validate(getIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.practiceService.getPracticeById(
      id.toString(),
      tenantName,
    );
  }

  @Put(':id')
  @updatePracticeSwagger()
  async updatePractice(
    @Param('id') id: string,
    @Body() practiceData: UpdatePracticeDto,
    @Request() req,
  ) {
    const tenantName = req.headers.tenant_code;
    const updateDto = plainToClass(UpdatePracticeDto, practiceData);
    const errors = await validate(updateDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.practiceService.updatePractice(id, tenantName, updateDto);
  }

  @Delete(':id')
  @deletePracticeSwagger()
  async deletePractice(@Param('id') id: string, @Request() req) {
    const tenantName = req.headers.tenant_code;
    const deleteDto = plainToClass(PracticeDeleteIdDto, { id });
    const errors = await validate(deleteDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.practiceService.deletePractice(id, tenantName);
  }
}
