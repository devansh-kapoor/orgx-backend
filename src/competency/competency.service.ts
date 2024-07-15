import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { CompetencyQueriesService } from './competencyQueries.service'; // Import the new service

@Injectable()
export class CompetencyService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly competencyQueriesService: CompetencyQueriesService, // Inject the new service
  ) {}

  async createCompetency(
    tenantCode: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const nameTenant = tenant.tenant_name;
    const existingCompetency =
      await this.competencyQueriesService.checkCompetencyName(
        nameTenant,
        userData.competency_name,
      );

    if (existingCompetency.length > 0) {
      throw new BadRequestException(
        'Competency with this name already exists. Please use another name.',
      );
    }

    const code = Math.floor(Math.random() * 9000) + 1000;
    await this.competencyQueriesService.createCompetency(
      nameTenant,
      userData,
      code,
    );

    const competencyData =
      await this.competencyQueriesService.checkCompetencyName(
        nameTenant,
        userData.competency_name,
      );

    return {
      message: 'Competency created successfully and data saved.',
      data: competencyData,
    };
  }

  async competencyName(
    tenantCode: string,
    userData: any,
  ): Promise<{ message: string; data?: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const existingCompetency =
      await this.competencyQueriesService.checkCompetencyName(
        nameTenant,
        userData.competency_name,
      );

    if (existingCompetency.length > 0) {
      return {
        message : 'Competency with this name already exists. Please use another name.', data  : existingCompetency[0]   }
      
    } else {
      return { message: 'Competency with this name can be created' };
    }
  }

  async getAllCompetencies(
    tenantCode: string,
  ): Promise<{ message: string; data: any[] }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const competencies =
      await this.competencyQueriesService.getAllCompetencies(nameTenant);

    return {
      message: 'Retrieved all competencies successfully.',
      data: competencies,
    };
  }

  async getCompetencyById(
    id: string,
    tenantCode: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const competency = await this.competencyQueriesService.getCompetencyById(
      nameTenant,
      id,
    );

    if (competency.length === 0) {
      return { message: 'Competency not found.', data: null };
    }
    return {
      message: 'Competency retrieved successfully.',
      data: competency[0],
    };
  }

  async updateCompetency(
    id: string,
    tenantCode: string,
    userData: any,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const competency = await this.competencyQueriesService.getCompetencyById(
      nameTenant,
      id,
    );

    if (competency.length === 0) {
      throw new NotFoundException('Competency not found.');
    }

    await this.competencyQueriesService.updateCompetency(
      nameTenant,
      id,
      userData,
    );

    const updatedCompetency =
      await this.competencyQueriesService.getCompetencyById(nameTenant, id);

    return {
      message: 'Competency updated successfully.',
      data: updatedCompetency[0],
    };
  }

  async deleteCompetency(
    id: string,
    tenantCode: string,
  ): Promise<{ message: string }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_name: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const competency = await this.competencyQueriesService.getCompetencyById(
      nameTenant,
      id,
    );

    if (competency.length === 0) {
      throw new NotFoundException('Competency not found.');
    }

    await this.competencyQueriesService.deleteCompetency(nameTenant, id);

    return { message: 'Competency deleted successfully.' };
  }
}
