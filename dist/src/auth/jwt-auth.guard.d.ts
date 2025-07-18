import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../user/user.service';
declare const JwtStrategy_base: new (...args: unknown[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: any): Promise<{
        userId: any;
        username: any;
    }>;
}
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base implements CanActivate {
    private requiredRole?;
    constructor(requiredRole?: string);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
