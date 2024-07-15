"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("../tenant/tenant.entity");
const projectQueries_service_1 = require("./projectQueries.service");
const user_service_1 = require("../user/user.service");
let ProjectService = class ProjectService {
    constructor(tenantRepository, projectQueriesService, userService) {
        this.tenantRepository = tenantRepository;
        this.projectQueriesService = projectQueriesService;
        this.userService = userService;
    }
    async getEmployees(tenantCode, managedId, leadId, developer) {
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
    async checkEmployeeExist(tenantCode, developer) {
        let dev;
        for (let i = 0; i < developer.length; i++) {
            dev = await this.userService.getUserById(developer[i], tenantCode);
            if (dev.data == null) {
                throw new common_1.NotFoundException(`Employee not found of id ${developer[i]}`);
            }
        }
    }
    async createProject(tenantCode, userData) {
        const tenant = await this.tenantRepository.findOne({
            where: { tenant_code: tenantCode },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const nameTenant = tenant.tenant_name;
        const existingProject = await this.projectQueriesService.checkProjectName(nameTenant, userData.title);
        if (existingProject && existingProject.length > 0) {
            throw new common_1.BadRequestException('Project with this name already exists. Please use another name.');
        }
        const empExist = await this.checkEmployeeExist(tenantCode, userData.developer);
        await this.projectQueriesService.createProject(nameTenant, userData);
        const projectData = await this.projectQueriesService.checkProjectName(nameTenant, userData.title);
        if (projectData && projectData.length > 0) {
            let emp = await this.getEmployees(tenantCode, projectData[0].project_manager, projectData[0].team_lead, projectData[0].developer);
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
        }
        else {
            throw new common_1.BadRequestException('Project not created');
        }
    }
    async getAllProjects(tenantCode) {
        const tenant = await this.tenantRepository.findOne({
            where: { tenant_code: tenantCode },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const nameTenant = tenant.tenant_name;
        const projectData = await this.projectQueriesService.getAllProjects(nameTenant);
        if (projectData && projectData.length > 0) {
            let finalData = [];
            for (let j = 0; j < projectData.length; j++) {
                let emp = await this.getEmployees(tenantCode, projectData[j].project_manager, projectData[j].team_lead, projectData[j].developer);
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
        }
        else {
            return {
                message: 'No project exist.',
                data: [],
            };
        }
    }
    async getProjectById(id, tenantCode) {
        const tenant = await this.tenantRepository.findOne({
            where: { tenant_code: tenantCode },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const nameTenant = tenant.tenant_name;
        const projectData = await this.projectQueriesService.getProjectById(nameTenant, id);
        if (projectData && projectData.length > 0) {
            let emp = await this.getEmployees(tenantCode, projectData[0].project_manager, projectData[0].team_lead, projectData[0].developer);
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
        }
        else {
            return {
                message: 'No project exist.',
                data: [],
            };
        }
    }
    async updateProject(id, tenantCode, userData) {
        const tenant = await this.tenantRepository.findOne({
            where: { tenant_code: tenantCode },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const nameTenant = tenant.tenant_name;
        const projectId = await this.projectQueriesService.getProjectById(nameTenant, id);
        if (projectId.length === 0) {
            throw new common_1.NotFoundException('Project not found.');
        }
        if (userData.start_date > userData.end_date) {
            throw new common_1.BadRequestException('Start date cannot be greater than end date ');
        }
        await this.projectQueriesService.updateProject(nameTenant, id, userData);
        const projects = await this.getProjectById(id, tenantCode);
        return {
            message: 'project updated successfully.',
            data: projects,
        };
    }
    async deleteProject(id, tenantCode) {
        const tenant = await this.tenantRepository.findOne({
            where: { tenant_code: tenantCode },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const nameTenant = tenant.tenant_name;
        const project = await this.projectQueriesService.getProjectById(nameTenant, id);
        if (project.length === 0) {
            throw new common_1.NotFoundException('project not found.');
        }
        await this.projectQueriesService.deleteProject(nameTenant, id);
        return { message: 'Project deleted successfully.' };
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        projectQueries_service_1.ProjectQueriesService,
        user_service_1.UserService])
], ProjectService);
//# sourceMappingURL=project.service.js.map