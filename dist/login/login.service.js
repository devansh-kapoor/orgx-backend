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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const Joi = __importStar(require("joi"));
const pg_1 = require("pg");
const loginQueries_1 = require("./loginQueries");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let LoginService = class LoginService {
    constructor(loginQueries, jwtService) {
        this.loginQueries = loginQueries;
        this.jwtService = jwtService;
        this.pool = new pg_1.Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'multi_tenant_app',
            password: 'root',
            port: 5432,
        });
    }
    async login(body) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            role: Joi.string().required(),
            tenant_code: Joi.when('role', {
                is: Joi.string().valid('employee'),
                then: Joi.string().required(),
                otherwise: Joi.string().optional(),
            }),
        });
        const { error } = schema.validate(body);
        if (error) {
            throw new common_1.BadRequestException(error.details[0].message);
        }
        try {
            if (body.role == 'super_admin') {
                return this.adminLogin(body);
            }
            else if (body.role === 'admin') {
                return this.tenantLogin(body);
            }
            else if (body.role === 'employee') {
                if (!body.tenant_code) {
                    throw new common_1.NotFoundException('Tenant code Not Found');
                }
                return this.employeeLogin(body);
            }
            else {
                throw new common_1.BadRequestException('User not found');
            }
        }
        catch (err) {
            throw new common_1.BadRequestException('User not found', err.message);
        }
    }
    async tenantLogin(body) {
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM tenant WHERE tenant_email = $1', [body.email]);
            if (result.rows.length === 0) {
                throw new common_1.BadRequestException('Tenant does not exist');
            }
            const tenant = result.rows[0];
            if (!bcrypt.compareSync(body.password, tenant.password)) {
                throw new common_1.BadRequestException('Incorrect password');
            }
            const token = this.jwtService.sign({
                email: tenant.email,
                id: tenant.id,
                code: tenant.code,
                role: 'admin',
            });
            delete tenant.password;
            const tenantDetail = { ...tenant, token };
            return { message: 'Tenant login successful', user: tenantDetail };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
        finally {
            client.release();
        }
    }
    async employeeLogin(body) {
        try {
            const client = await this.pool.connect();
            const tenantResult = await client.query('SELECT * FROM tenant WHERE tenant_code = $1', [body.tenant_code]);
            if (tenantResult.rows.length > 0) {
                const tenant = tenantResult.rows[0];
                const employees = await this.loginQueries.getEmployeeByEmail(tenant.tenant_name, body.email);
                if (employees.length === 0) {
                    throw new common_1.BadRequestException('Employee not found');
                }
                const employee = employees[0];
                if (!bcrypt.compareSync(body.password, employee.password)) {
                    throw new common_1.BadRequestException('Incorrect password');
                }
                const token = this.jwtService.sign({
                    email: employee.email,
                    id: employee.id,
                    code: tenant.code,
                    role: 'employee',
                });
                delete employee.password;
                employee['tenant_code'] = body.tenant_code;
                const employeeDetail = { ...employee, token };
                return {
                    message: 'Employee login successful',
                    user: employeeDetail,
                };
            }
            else {
                throw new common_1.BadRequestException('User not found');
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async adminLogin(body) {
        const client = await this.pool.connect();
        try {
            const query = `SELECT * FROM admin WHERE email = $1`;
            const result = await client.query(query, [body.email]);
            if (result.rows.length === 0) {
                throw new common_1.BadRequestException('Admin with this email not found');
            }
            const admin = result.rows[0];
            if (!bcrypt.compareSync(body.password, admin.password)) {
                throw new common_1.BadRequestException('Incorrect password');
            }
            const token = this.jwtService.sign({
                email: admin.email,
                id: admin.id,
                role: 'super_admin',
            });
            delete admin.password;
            const adminWithToken = { ...admin, token };
            return { message: 'Admin login successful', user: adminWithToken };
        }
        finally {
            client.release();
        }
    }
};
exports.LoginService = LoginService;
exports.LoginService = LoginService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [loginQueries_1.LoginQueries,
        jwt_1.JwtService])
], LoginService);
//# sourceMappingURL=login.service.js.map