import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async createTenant(tenantData: {
    tenant_name: string;
    tenant_email: string;
    role: string;
    tenant_code: string;
    password: string;
    status: string;
    phone?: string;
    location?: string;
    subscription_details?: string[];
    company_type?: string;
    image?: string;
  }): Promise<{ message: string; data?: Tenant }> {
    // Check if tenant with the same name already exists
    const existingTenantName = await this.tenantRepository.findOne({
      where: { tenant_name: tenantData.tenant_name },
    });
    if (existingTenantName) {
      return {
        message: `Tenant with name '${tenantData.tenant_name}' already exists.`,
        data: undefined,
      };
    }

    // Check if tenant with the same email already exists
    const existingTenantEmail = await this.tenantRepository.findOne({
      where: { tenant_email: tenantData.tenant_email },
    });
    if (existingTenantEmail) {
      return {
        message: `Tenant with email '${tenantData.tenant_email}' already exists.`,
        data: undefined,
      };
    }

    // Check if tenant with the same tenant_code already exists
    let tenantCode: string;
    let existingTenantCode: Tenant | undefined;

    do {
      tenantCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generates a random 4-digit number
      existingTenantCode = await this.tenantRepository.findOne({
        where: { tenant_code: tenantCode },
      });
    } while (existingTenantCode);

    const tenant = new Tenant();
    tenant.tenant_name = tenantData.tenant_name.toLocaleLowerCase();
    tenant.tenant_email = tenantData.tenant_email;
    tenant.role = tenantData.role;
    tenant.tenant_code = tenantCode;
    tenant.password = await bcrypt.hash(tenantData.password, 10);
    tenant.status = tenantData.status;
    tenant.location = tenantData.location;
    tenant.subscription_details = tenantData.subscription_details;
    tenant.company_type = tenantData.company_type;
    tenant.image = tenantData.image;

    await this.tenantRepository.save(tenant);

    // Create the database for the tenant
    await this.createDatabase(tenant.tenant_name);

    // Add tenant database configuration to dbConfig.json
    await this.addTenantConfig(tenant.tenant_name);

    return { message: 'Tenant created successfully.', data: tenant };
  }

  private async createDatabase(databaseName: string): Promise<void> {
    const queryRunner =
      this.tenantRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    const old_db = 'dummy_db';
    try {
      await queryRunner.query(
        `CREATE database ${databaseName} TEMPLATE = ${old_db}`,
      );
      //await queryRunner.query(`ALTER SCHEMA public RENAME TO public`);
    } catch (err) {
      console.error('Error cloning database:', err);
    } finally {
      await queryRunner.release();
    }
  }

  private async addTenantConfig(databaseName: string): Promise<void> {
    const dbConfigPath = path.join(__dirname, '../../src/dbConfig.json');
    try {
      // Read the existing dbConfig.json file
      const data = fs.readFileSync(dbConfigPath, 'utf8');
      let config;

      // Parse the JSON data and validate its structure
      try {
        config = JSON.parse(data);
        if (!config.tenants || !Array.isArray(config.tenants)) {
          config.tenants = [];
        }
      } catch (err) {
        config = { tenants: [] };
      }

      // Create the new tenant configuration
      const newTenantConfig = {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'root',
        database: databaseName,
      };

      // Add the new tenant configuration to the tenants array
      config.tenants.push(newTenantConfig);

      // Write the updated configuration back to dbConfig.json
      fs.writeFileSync(dbConfigPath, JSON.stringify(config, null, 2), 'utf8');
      console.log('Tenant configuration added successfully');
    } catch (err) {
      console.error('Error adding tenant configuration:', err);
      throw new Error('Failed to add tenant configuration');
    }
  }
}
