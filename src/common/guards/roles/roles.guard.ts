import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";
 
@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
        
        if (!roles) return true;
        
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        
        if (!user || !user.role) return false;
        
        return roles.includes(user.role);
    }
}