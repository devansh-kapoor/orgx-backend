"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectQueriesService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const dbConfig_json_1 = __importDefault(require("../dbConfig.json"));
let ProjectQueriesService = class ProjectQueriesService {
    getTenantDbConfig(tenantName) {
        for (const tenant of dbConfig_json_1.default.tenants) {
            if (tenant.database.toLowerCase() === tenantName.toLowerCase()) {
                return tenant;
            }
        }
        return undefined;
    }
    async executeQuery(tenantName, queryText, values) {
        const tenantDbConfig = this.getTenantDbConfig(tenantName);
        if (!tenantDbConfig) {
            throw new Error('Tenant database configuration not found.');
        }
        const pool = new pg_1.Pool(tenantDbConfig);
        let client;
        try {
            client = await pool.connect();
            const result = await client.query(queryText, values);
            return result.rows;
        }
        catch (error) {
            throw new Error(`Failed to execute query: ${error.message}`);
        }
        finally {
            if (client) {
                client.release();
            }
            await pool.end();
        }
    }
    async checkProjectName(tenantName, title) {
        const query = `
      SELECT * FROM public.project
      WHERE title = $1
    `;
        return this.executeQuery(tenantName, query, [title]);
    }
    async getEmployeesByProject(tenantName, title) {
        const query = `
      SELECT * FROM public.project
      WHERE title = $1 

    `;
        return this.executeQuery(tenantName, query, [title]);
    }
    async createProject(tenantName, userData) {
        const query = `
      INSERT INTO public.project (
        title,
        timeline,
        start_date,
        end_date,
        status,
        project_manager,
        team_lead,
        developer,
        description,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,NOW(), NOW()
      )
    `;
        const values = [
            userData.title,
            userData.timeline,
            userData.start_date,
            userData.end_date,
            userData.status,
            userData.project_manager,
            userData.team_lead,
            userData.developer,
            userData.description,
        ];
        return this.executeQuery(tenantName, query, values);
    }
    async getAllProjects(tenantName) {
        const query = `
      SELECT * FROM public.project
    `;
        return this.executeQuery(tenantName, query);
    }
    async getProjectById(tenantName, id) {
        const query = `
      SELECT * FROM public.project
      WHERE id = $1
    `;
        return this.executeQuery(tenantName, query, [id]);
    }
    async updateProject(tenantName, id, userData) {
        const query = `
      UPDATE public.project
      SET
        title = $1,
        timeline = $2,
        start_date = $3,
        end_date = $4,
        status = $5,
        project_manager = $6,
        team_lead = $7,
        developer = $8,
        description  = $9,
        updated_at = NOW()
      WHERE id = $10
    `;
        const values = [
            userData.title,
            userData.timeline,
            userData.start_date,
            userData.end_date,
            userData.status,
            userData.project_manager,
            userData.team_lead,
            userData.developer,
            userData.description,
            id,
        ];
        return this.executeQuery(tenantName, query, values);
    }
    async deleteProject(tenantName, id) {
        const query = `
      DELETE FROM public.project
      WHERE id = $1
    `;
        return this.executeQuery(tenantName, query, [id]);
    }
};
exports.ProjectQueriesService = ProjectQueriesService;
exports.ProjectQueriesService = ProjectQueriesService = __decorate([
    (0, common_1.Injectable)()
], ProjectQueriesService);
//# sourceMappingURL=projectQueries.service.js.map