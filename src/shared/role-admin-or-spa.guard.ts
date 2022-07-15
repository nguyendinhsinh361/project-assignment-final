/* eslint-disable prettier/prettier */

import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from 'src/api/user/models/entities/user-role.enum';
import { ROLES_KEY } from './config.decorator';

// @Injectable()
// export class RoleAdminOrSuperAdmin extends AuthGuard('jwt')  {
//   async canActivate(context: ExecutionContext): Promise<boolean> {

//     // call AuthGuard in order to ensure user is injected in request
//     const baseGuardResult = await super.canActivate(context);
    

//     // successfull authentication, user is injected
//     const {user} = context.switchToHttp().getRequest();
//     if(user.role === 'user') {
//       return false;
//     }
//     return true;
//   }
// }

@Injectable()
export class RoleAdminOrSuperAdmin implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return !requiredRoles.some((role) => user.role?.includes(role));
  }
}
