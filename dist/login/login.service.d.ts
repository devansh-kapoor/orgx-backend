import { LoginQueries } from './loginQueries';
import { JwtService } from '@nestjs/jwt';
export declare class LoginService {
    private readonly loginQueries;
    private readonly jwtService;
    private readonly pool;
    constructor(loginQueries: LoginQueries, jwtService: JwtService);
    login(body: {
        email: string;
        password: string;
        role: string;
        tenant_code?: string;
        domain?: string;
    }): Promise<any>;
    tenantLogin(body: {
        email: string;
        password: string;
    }): Promise<any>;
    employeeLogin(body: {
        email: string;
        password: string;
        tenant_code?: string;
    }): Promise<any>;
    adminLogin(body: {
        email: string;
        password: string;
    }): Promise<any>;
}
