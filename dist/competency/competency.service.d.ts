import { Repository } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { CompetencyQueriesService } from './competencyQueries.service';
export declare class CompetencyService {
    private readonly tenantRepository;
    private readonly competencyQueriesService;
    constructor(tenantRepository: Repository<Tenant>, competencyQueriesService: CompetencyQueriesService);
    createCompetency(tenantCode: string, userData: any): Promise<{
        message: string;
        data?: any;
    }>;
    competencyName(tenantCode: string, userData: any): Promise<{
        message: string;
        data?: any;
    }>;
    getAllCompetencies(tenantCode: string): Promise<{
        message: string;
        data: any[];
    }>;
    getCompetencyById(id: string, tenantCode: string): Promise<{
        message: string;
        data: any;
    }>;
    updateCompetency(id: string, tenantCode: string, userData: any): Promise<{
        message: string;
        data: any;
    }>;
    deleteCompetency(id: string, tenantCode: string): Promise<{
        message: string;
    }>;
}
