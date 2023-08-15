import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import {
  GetSubjectIdFn,
  PermissionSubjectTarget,
  REQUIRED_PERMISSION,
  RequiredPermission,
} from '../decorators/permissions.decorator';
import { PermissionEffect } from '../enums/permission-effect.enum';
import Role from '../enums/role.enum';
import {
  getPermittedSubjectIds,
  grantedMatchRequired,
} from '../permissions.helper';
import { PermissionsService } from '../permissions.service';
import { Permission } from '../types/permission.type';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly permissionsService: PermissionsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];
    console.log(token);
    request['user'] = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
    const { id: userId } = request.user;

    const requiredPermission = this.getRequiredPermission(context);

    const { role, permissions: grantedPermissions } =
      await this.permissionsService.getMany(userId);

    if (!grantedPermissions.length) {
      return false;
    }

    const permitted = grantedMatchRequired(
      grantedPermissions,
      requiredPermission,
    );

    if (!permitted) {
      return false;
    }

    let allowedSubjectsIds: string[] = null;
    let deniedSubjectsIds: string[] = null;

    if (requiredPermission.target === PermissionSubjectTarget.SOME) {
      if ([Role.BUYER, Role.USER].includes(role)) {
        allowedSubjectsIds = getPermittedSubjectIds(
          grantedPermissions,
          requiredPermission,
          PermissionEffect.ALLOW,
        );
      } else if (Role.MANAGER === role) {
        deniedSubjectsIds = getPermittedSubjectIds(
          grantedPermissions,
          requiredPermission,
          PermissionEffect.DENY,
        );
      }
    }

    request.permissionsContext = {
      allowedSubjectsIds,
      deniedSubjectsIds,
      grantedPermissions,
    };

    return true;
  }

  /**
   * Computes permission required to access controller action, based on
   * controller permissions decorator. If resource target is dynamic (based on
   * incoming request), evaluate it.
   * @param context request context
   * @returns computed required permission
   */
  private getRequiredPermission(context: ExecutionContext): Permission {
    const permission = this.reflector.get<RequiredPermission>(
      REQUIRED_PERMISSION,
      context.getHandler(),
    );
    console.log(permission);

    const request = context.switchToHttp().getRequest();

    if (!permission) {
      throw new Error(
        `missing permissions definition for ${request.method} ${request.url}`,
      );
    }

    if (permission.target instanceof Function) {
      return {
        ...permission,
        target: (permission.target as GetSubjectIdFn)(request),
      };
    }

    return permission as Permission;
  }
}
