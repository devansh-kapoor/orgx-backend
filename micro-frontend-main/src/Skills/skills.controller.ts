import { Controller, Post, Body, Get, Param, Put, Delete, Request, BadRequestException, NotFoundException } from '@nestjs/common';
import { SkillService } from './skills.service';
import { createSkillSwagger, skillNameSwagger, getAllSkillsSwagger, getSkillByIdSwagger } from './skills.swagger';
import { CreateSkillDto, SkillNameDto, SkillIdDto } from './skills.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';


@Controller('skill')
export class SkillController {
    constructor(private readonly SkillService: SkillService) {}

    @Post()
    @createSkillSwagger()
    async createSkill(@Request() req, @Body() userData: CreateSkillDto) {
        const tenantCode = req.headers.tenant_code; 
        const competencyData = plainToClass(CreateSkillDto, userData);
        const errors = await validate(competencyData);
        if (errors.length > 0) {
            const errorMessage = Object.values(errors[0].constraints).join(', ');
            throw new BadRequestException({ message: errorMessage });
        }
        return await this.SkillService.createSkill(tenantCode, userData);
    }

    @Post('skillName')
    @skillNameSwagger()
    async skillName(@Request() req, @Body() data: SkillNameDto) {
        const tenantCode = req.headers.tenant_code; 
        const competencyData = plainToClass(SkillNameDto, data);
        const errors = await validate(competencyData);
        if (errors.length > 0) {
            const errorMessage = Object.values(errors[0].constraints).join(', ');
            throw new BadRequestException({ message: errorMessage });
        }
        return await this.SkillService.skillName(tenantCode, data);
    }

    @Get()
    @getAllSkillsSwagger()
    async getAllSkills(@Request() req) {
        const tenantCode = req.headers.tenant_code; 
        return await this.SkillService.getAllSkills(tenantCode);
    }

    @Get(':id')
    @getSkillByIdSwagger()
    async getSkillById(@Param('id') id: string, @Request() req) {
        const tenantCode = req.headers.tenant_code;
        const competencyIdDto = plainToClass(SkillIdDto, { id });
        const errors = await validate(competencyIdDto);
        if (errors.length > 0) {
            const errorMessage = Object.values(errors[0].constraints).join(', ');
            throw new BadRequestException({ message: errorMessage });
        }
        return await this.SkillService.getSkillById(id, tenantCode);
    }

   
}
