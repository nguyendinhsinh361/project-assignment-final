/* eslint-disable prettier/prettier */


import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common'
import { UserRoleEnum } from 'src/api/user/models/entities/user-role.enum';
import { User } from 'src/api/user/models/entities/user.entity';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
})

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoleEnum[]) => SetMetadata(ROLES_KEY, roles);