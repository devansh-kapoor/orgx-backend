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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginQueries = void 0;
const pg_1 = require("pg");
const dbConfig_json_1 = __importDefault(require("../dbConfig.json"));
const common_1 = require("@nestjs/common");
function getTenantDbConfig(tenantName) {
    for (const tenant of dbConfig_json_1.default.tenants) {
        if (tenant.database.toLowerCase() === tenantName.toLowerCase()) {
            return tenant;
        }
    }
    return undefined;
}
async function executeQuery(tenantName, queryText, values) {
    const tenantDbConfig = getTenantDbConfig(tenantName);
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
        console.error('Error executing query:', error);
        throw new Error(`Failed to execute query: ${error.message}`);
    }
    finally {
        if (client) {
            client.release();
        }
        await pool.end();
    }
}
let LoginQueries = class LoginQueries {
    constructor() { }
    async getEmployeeByEmail(tenantName, email) {
        const query = 'SELECT * FROM employee WHERE email = $1';
        return await executeQuery(tenantName, query, [email]);
    }
};
exports.LoginQueries = LoginQueries;
exports.LoginQueries = LoginQueries = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoginQueries);
//# sourceMappingURL=loginQueries.js.map