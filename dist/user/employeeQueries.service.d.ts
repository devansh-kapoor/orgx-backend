import { CompetencyQueriesService } from 'src/competency/competencyQueries.service';
export declare class EmployeeQueriesService {
    private readonly competencyQueriesService;
    constructor(competencyQueriesService: CompetencyQueriesService);
    private getTenantDbConfig;
    private executeQuery;
    getAllEmployees(tenantName: string): Promise<{
        message: string;
        data: any[];
    }>;
    createEmployee(tenantName: string, employeeData: any): Promise<{
        message: string;
        data?: any;
    }>;
    filterUsersByName(tenantName: string, name: string): Promise<{
        message: string;
        data?: any[];
    }>;
    checkUserByEmail(tenantName: string, email: string): Promise<{
        message: string;
        data?: any[];
    }>;
    getUserById(tenantName: string, id: string): Promise<{
        message: string;
        data: any;
    }>;
    updateEmployee(tenantName: string, id: string, userData: any): Promise<{
        message: string;
        data?: any;
    }>;
    deleteEmployee(tenantName: string, id: string): Promise<{
        message: string;
    }>;
    filterUsersByLocation(tenantName: string, location: string): Promise<{
        message: string;
        data: any;
    }>;
    getAllDesignations(tenantName: string): Promise<{
        message: string;
        data: any[];
    }>;
}
