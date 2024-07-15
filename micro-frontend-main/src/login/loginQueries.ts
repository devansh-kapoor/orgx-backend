import { Pool, PoolClient } from 'pg';
import dbConfig from '../dbConfig.json';
import { Injectable } from '@nestjs/common';

interface TenantConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

function getTenantDbConfig(tenantName: string): TenantConfig | undefined {
  for (const tenant of dbConfig.tenants) {
    if (tenant.database.toLowerCase() === tenantName.toLowerCase()) {
      return tenant;
    }
  }
  return undefined;
}

async function executeQuery(
  tenantName: string,
  queryText: string,
  values?: any[],
): Promise<any> {
  const tenantDbConfig = getTenantDbConfig(tenantName);

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
    console.error('Error executing query:', error);
    throw new Error(`Failed to execute query: ${error.message}`);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end(); // Close the pool after executing the query
  }
}

@Injectable()
export class LoginQueries {
  constructor() {}

  async getEmployeeByEmail(tenantName: string, email: string): Promise<any[]> {
    const query = 'SELECT * FROM employee WHERE email = $1';
    return await executeQuery(tenantName, query, [email]);
  }
}
