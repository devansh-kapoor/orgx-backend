"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("./tenant.entity");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const bcrypt = __importStar(require("bcrypt"));
let TenantService = class TenantService {
    constructor(tenantRepository) {
        this.tenantRepository = tenantRepository;
    }
    async createTenant(tenantData) {
        const existingTenantName = await this.tenantRepository.findOne({
            where: { tenant_name: tenantData.tenant_name },
        });
        if (existingTenantName) {
            return {
                message: `Tenant with name '${tenantData.tenant_name}' already exists.`,
                data: undefined,
            };
        }
        const existingTenantEmail = await this.tenantRepository.findOne({
            where: { tenant_email: tenantData.tenant_email },
        });
        if (existingTenantEmail) {
            return {
                message: `Tenant with email '${tenantData.tenant_email}' already exists.`,
                data: undefined,
            };
        }
        let tenantCode;
        let existingTenantCode;
        do {
            tenantCode = Math.floor(1000 + Math.random() * 9000).toString();
            existingTenantCode = await this.tenantRepository.findOne({
                where: { tenant_code: tenantCode },
            });
        } while (existingTenantCode);
        const tenant = new tenant_entity_1.Tenant();
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
        await this.createDatabase(tenant.tenant_name);
        await this.addTenantConfig(tenant.tenant_name);
        return { message: 'Tenant created successfully.', data: tenant };
    }
    async createDatabase(databaseName) {
        const queryRunner = this.tenantRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        const old_db = 'dummy_db';
        try {
            await queryRunner.query(`CREATE database ${databaseName} TEMPLATE = ${old_db}`);
        }
        catch (err) {
            console.error('Error cloning database:', err);
        }
        finally {
            await queryRunner.release();
        }
    }
    async addTenantConfig(databaseName) {
        const dbConfigPath = path.join(__dirname, '../../src/dbConfig.json');
        try {
            const data = fs.readFileSync(dbConfigPath, 'utf8');
            let config;
            try {
                config = JSON.parse(data);
                if (!config.tenants || !Array.isArray(config.tenants)) {
                    config.tenants = [];
                }
            }
            catch (err) {
                config = { tenants: [] };
            }
            const newTenantConfig = {
                host: 'localhost',
                port: 5432,
                user: 'postgres',
                password: 'root',
                database: databaseName,
            };
            config.tenants.push(newTenantConfig);
            fs.writeFileSync(dbConfigPath, JSON.stringify(config, null, 2), 'utf8');
            console.log('Tenant configuration added successfully');
        }
        catch (err) {
            console.error('Error adding tenant configuration:', err);
            throw new Error('Failed to add tenant configuration');
        }
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TenantService);
//# sourceMappingURL=tenant.service.js.map