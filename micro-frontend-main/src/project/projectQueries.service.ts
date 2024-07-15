import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import dbConfig from '../dbConfig.json';

interface TenantConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

@Injectable()
export class ProjectQueriesService {
  private getTenantDbConfig(tenantName: string): TenantConfig | undefined {
    for (const tenant of dbConfig.tenants) {
      if (tenant.database.toLowerCase() === tenantName.toLowerCase()) {
        return tenant;
      }
    }
    return undefined;
  }

  private async executeQuery(
    tenantName: string,
    queryText: string,
    values?: any[],
  ): Promise<any> {
    const tenantDbConfig = this.getTenantDbConfig(tenantName);

    if (!tenantDbConfig) {
      throw new Error('Tenant database configuration not found.');
    }

    const pool = new Pool(tenantDbConfig);

    let client: PoolClient;
    try {
      client = await pool.connect();
      const result = await client.query(queryText, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to execute query: ${error.message}`);
    } finally {
      if (client) {
        client.release();
      }
      await pool.end(); // Close the pool after executing the query
    }
  }

  async checkProjectName(tenantName: string, title: string): Promise<any> {
    const query = `
      SELECT * FROM public.project
      WHERE title = $1
    `;
    return this.executeQuery(tenantName, query, [title]);
  }

  async getEmployeesByProject(tenantName: string, title: string): Promise<any> {
    const query = `
      SELECT * FROM public.project
      WHERE title = $1 

    `;
    return this.executeQuery(tenantName, query, [title]);
  }

  async createProject(tenantName: string, userData: any): Promise<any> {
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

  async getAllProjects(tenantName: string): Promise<any> {
    const query = `
      SELECT * FROM public.project
    `;
    return this.executeQuery(tenantName, query);
  }

  async getProjectById(tenantName: string, id: string): Promise<any> {
    const query = `
      SELECT * FROM public.project
      WHERE id = $1
    `;
    return this.executeQuery(tenantName, query, [id]);
  }

  async updateProject(
    tenantName: string,
    id: string,
    userData: any,
  ): Promise<any> {
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

  async deleteProject(tenantName: string, id: string): Promise<any> {
    const query = `
      DELETE FROM public.project
      WHERE id = $1
    `;
    return this.executeQuery(tenantName, query, [id]);
  }
}
