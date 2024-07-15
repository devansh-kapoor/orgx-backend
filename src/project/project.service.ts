import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { ProjectQueriesService } from './projectQueries.service'; // Import the new service
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly projectQueriesService: ProjectQueriesService, // Inject the new service
    private readonly userService: UserService, // Inject the new service
  ) {}

  async getEmployees(
    tenantCode: string,
    managedId: string,
    leadId: string,
    developer: Array<any>,
  ): Promise<any> {
    let manager = await this.userService.getUserById(managedId, tenantCode);
    let lead = await this.userService.getUserById(leadId, tenantCode);
    let developers = [];
    for (let i = 0; i < developer.length; i++) {
      let dev = await this.userService.getUserById(developer[i], tenantCode);
      developers.push({
        empId: dev.data.id,
        firstName: dev.data.first_name,
        lastName: dev.data.last_name,
        designation: dev.data.designation,
        studio: dev.data.studio_name,
      });
    }
    let data = {
      project_manager: {
        empId: manager.data.id,
        firstName: manager.data.first_name,
        lastName: manager.data.last_name,
        designation: manager.data.designation,
        studio: manager.data.studio_name,
      },
      team_lead: {
        empId: lead.data.id,
        firstName: lead.data.first_name,
        lastName: lead.data.last_name,
        designation: lead.data.designation,
        studio: lead.data.studio_name,
      },
      developer: developers,
    };
    return data;
  }

  async checkEmployeeExist(
    tenantCode: string,
    developer: Array<any>,
  ): Promise<any> {
    let dev;
    for (let i = 0; i < developer.length; i++) {
      dev = await this.userService.getUserById(developer[i], tenantCode);
      if (dev.data == null) {
        throw new NotFoundException(`Employee not found of id ${developer[i]}`);
      }
    }
  }
  async createProject(
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
    const existingProject = await this.projectQueriesService.checkProjectName(
      nameTenant,
      userData.title,
    );

    if (existingProject && existingProject.length > 0) {
      throw new BadRequestException(
        'Project with this name already exists. Please use another name.',
      );
    }

    const empExist = await this.checkEmployeeExist(
      tenantCode,
      userData.developer,
    );

    await this.projectQueriesService.createProject(nameTenant, userData);

    const projectData = await this.projectQueriesService.checkProjectName(
      nameTenant,
      userData.title,
    );

    if (projectData && projectData.length > 0) {
      let emp = await this.getEmployees(
        tenantCode,
        projectData[0].project_manager,
        projectData[0].team_lead,
        projectData[0].developer,
      );
      let finalData = {
        projectId: projectData[0].id,
        title: projectData[0].title,
        timeline: projectData[0].timeline,
        status: projectData[0].status,
        start_date: projectData[0].start_date,
        end_date: projectData[0].end_date,
        duration: projectData[0].duration,
        project_manager: emp.project_manager,
        team_lead: emp.team_lead,
        developer: emp.developer,
      };

      return {
        message: 'Project created successfully and data saved.',
        data: finalData,
      };
    } else {
      throw new BadRequestException('Project not created');
    }
  }

  async getAllProjects(
    tenantCode: string,
  ): Promise<{ message: string; data: any }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const projectData =
      await this.projectQueriesService.getAllProjects(nameTenant);

    if (projectData && projectData.length > 0) {
      let finalData = [];
      for (let j = 0; j < projectData.length; j++) {
        let emp = await this.getEmployees(
          tenantCode,
          projectData[j].project_manager,
          projectData[j].team_lead,
          projectData[j].developer,
        );
        finalData.push({
          projectId: projectData[j].id,
          title: projectData[j].title,
          timeline: projectData[j].timeline,
          status: projectData[j].status,
          start_date: projectData[j].start_date,
          end_date: projectData[j].end_date,
          duration: projectData[j].duration,
          project_manager: emp.project_manager,
          team_lead: emp.team_lead,
          developer: emp.developer,
        });
      }
      return {
        message: 'Project retreived successfully',
        data: finalData,
      };
    } else {
      return {
        message: 'No project exist.',
        data: [],
      };
    }
  }

  async getProjectById(
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
    const projectData = await this.projectQueriesService.getProjectById(
      nameTenant,
      id,
    );

    if (projectData && projectData.length > 0) {
      let emp = await this.getEmployees(
        tenantCode,
        projectData[0].project_manager,
        projectData[0].team_lead,
        projectData[0].developer,
      );
      let finalData = {
        projectId: projectData[0].id,
        title: projectData[0].title,
        timeline: projectData[0].timeline,
        status: projectData[0].status,
        start_date: projectData[0].start_date,
        end_date: projectData[0].end_date,
        duration: projectData[0].duration,
        project_manager: emp.project_manager,
        team_lead: emp.team_lead,
        developer: emp.developer,
      };

      return {
        message: 'Project retreived successfully',
        data: finalData,
      };
    } else {
      return {
        message: 'No project exist.',
        data: [],
      };
    }
  }

  async updateProject(
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
    const projectId = await this.projectQueriesService.getProjectById(
      nameTenant,
      id,
    );

    if (projectId.length === 0) {
      throw new NotFoundException('Project not found.');
    }

    if (userData.start_date > userData.end_date) {
      throw new BadRequestException(
        'Start date cannot be greater than end date ',
      );
    }
    await this.projectQueriesService.updateProject(nameTenant, id, userData);

    const projects = await this.getProjectById(id, tenantCode);
    return {
      message: 'project updated successfully.',
      data: projects,
    };
  }

  async deleteProject(
    id: string,
    tenantCode: string,
  ): Promise<{ message: string }> {
    const tenant = await this.tenantRepository.findOne({
      where: { tenant_code: tenantCode },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    const nameTenant = tenant.tenant_name;
    const project = await this.projectQueriesService.getProjectById(
      nameTenant,
      id,
    );

    if (project.length === 0) {
      throw new NotFoundException('project not found.');
    }

    await this.projectQueriesService.deleteProject(nameTenant, id);

    return { message: 'Project deleted successfully.' };
  }
}
