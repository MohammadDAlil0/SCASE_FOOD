import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../constants/enums";
import { ROLES_KEY } from "../constants/constants";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
          context.getHandler(),
          context.getClass(),
      ]);
      if (requiredRoles.length === 0) {
          return true;
        }
        const request = context.switchToHttp().getRequest();
    
        if (!request.user) {
          throw new UnauthorizedException('User Id not found');
        }
        
        const user = request.user;
        if(!requiredRoles.includes(user.role)) {
          throw new UnauthorizedException(`You must be ${requiredRoles}`);
        }
        return true;
    }
}