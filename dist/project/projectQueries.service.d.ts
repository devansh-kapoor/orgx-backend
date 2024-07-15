export declare class ProjectQueriesService {
    private getTenantDbConfig;
    private executeQuery;
    checkProjectName(tenantName: string, title: string): Promise<any>;
    getEmployeesByProject(tenantName: string, title: string): Promise<any>;
    createProject(tenantName: string, userData: any): Promise<any>;
    getAllProjects(tenantName: string): Promise<any>;
    getProjectById(tenantName: string, id: string): Promise<any>;
    updateProject(tenantName: string, id: string, userData: any): Promise<any>;
    deleteProject(tenantName: string, id: string): Promise<any>;
}
