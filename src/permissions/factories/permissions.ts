import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';

import { Action } from '../enums/action.enum';
import { PermissionSubjectTarget } from '../enums/subject-target.enum';
import { PermissionSubject } from '../enums/subject-type.enum';
import {
  generatePermission,
  grantedMatchRequired,
} from '../permissions.helper';

export const PERMISSIONS = Symbol('PERMISSIONS');

@Injectable()
export class Permissions {
  constructor(@Inject(REQUEST) private readonly request: ExpressRequest) {}
  canActivate(
    subject: PermissionSubject,
    action: Action,
    target: PermissionSubjectTarget | string,
  ): boolean {
    const requiredPermission = generatePermission(subject, action, target);
    return grantedMatchRequired(
      this.context.grantedPermissions,
      requiredPermission,
    );
  }

  get allowedSubjectsIds(): string[] {
    return this.context.allowedSubjectsIds;
  }

  get deniedSubjectsIds(): string[] {
    return this.context.deniedSubjectsIds;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private get context(): ExpressRequest['permissionsContext'] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.request.permissionsContext;
  }
}
