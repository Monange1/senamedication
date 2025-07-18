import { UserService } from './user.service';
import { Response as ExpressResponse } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(req: any): Promise<any>;
    updateMe(req: any, body: any): Promise<any>;
    getMedications(req: any): Promise<any>;
    addMedication(req: any, med: any): Promise<any>;
    updateMedication(req: any, med: any, medId: string): Promise<any>;
    deleteMedication(req: any, medId: string): Promise<any>;
    getConditions(req: any): Promise<any>;
    addCondition(req: any, cond: any): Promise<any>;
    addConditionCheckup(req: any, condId: string, checkup: any): Promise<any>;
    updateCondition(req: any, cond: any, condId: string): Promise<any>;
    deleteCondition(req: any, condId: string): Promise<any>;
    getActivity(req: any): Promise<any>;
    addActivity(req: any, activity: any): Promise<any>;
    getAllUsers(req: any): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        isEmailVerified: any;
    }[]>;
    exportUsers(req: any, res: ExpressResponse): Promise<void>;
    getAuditLog(req: any): Promise<{
        id: any;
        name: any;
        email: any;
        activityLog: any;
    }[]>;
    adminEditUser(req: any, id: string, body: any): Promise<any>;
    adminDeleteUser(req: any, id: string): Promise<any>;
    adminResetPassword(req: any, id: string, body: {
        newPassword: string;
    }): Promise<any>;
}
