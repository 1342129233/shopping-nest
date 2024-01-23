export interface CreateDto {
    user: {
        username: string;
        password: string;
    };
    role: { 
        title: string
        description: string;
     };
    access: { 
        moduleName: string;
        type: number;
        actionName: string;
        icon: string;
        url: string;
        method: string;
        moduleId: number;
        sort: number;
        description: string;
    };
}
