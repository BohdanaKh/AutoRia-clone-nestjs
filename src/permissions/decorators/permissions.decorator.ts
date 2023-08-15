import { SetMetadata } from '@nestjs/common';
import { CustomDecorator } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { Request as ExpressRequest } from 'express';

import { Action } from '../enums/action.enum';
import { PermissionEffect } from '../enums/permission-effect.enum';
import { PermissionSubjectTarget } from '../enums/subject-target.enum';
import { PermissionSubject } from '../enums/subject-type.enum';
// Re-export imported enums, so that controllers that use the decorator can
// easily import all the required permission elements from one single import.
export { PermissionSubject, Action, PermissionSubjectTarget };

// eslint-disable-next-line @typescript-eslint/type-annotation-spacing
export type GetSubjectIdFn = (req: ExpressRequest) => string;

// export function GetSubjectIdFromParams(req: ExpressRequest): string {
//   const { id } = req.params;
//
//   if (!id) {
//     throw new Error('missing resource id in params');
//   }
//
//   return id;
// }

export const REQUIRED_PERMISSION = Symbol('REQUIRED_PERMISSION');

export type RequiredPermission = {
  subject: PermissionSubject;
  action: Action;
  target: PermissionSubjectTarget | GetSubjectIdFn;
  effect: PermissionEffect.ALLOW;
};
export const RequiresPermission = (
  subject: PermissionSubject,
  action: Action,
  target: PermissionSubjectTarget | GetSubjectIdFn,
): CustomDecorator<typeof REQUIRED_PERMISSION> =>
  SetMetadata(REQUIRED_PERMISSION, {
    subject,
    action,
    target,
    effect: PermissionEffect.ALLOW,
  });
