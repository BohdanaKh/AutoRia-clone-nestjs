import { Role } from '../users/enum/role.enum';
import { Action } from './enums/action.enum';
import { PermissionEffect } from './enums/permission-effect.enum';
import { PermissionSubjectTarget } from './enums/subject-target.enum';
import { PermissionSubject } from './enums/subject-type.enum';
import { Permission } from './types/permission.type';

export function generateGlobalPermissions(role: Role): Permission[] {
  switch (role) {
    case Role.ADMIN:
      return [
        generatePermission(
          PermissionSubject.ANY,
          Action.ANY,
          PermissionSubjectTarget.ANY,
        ),
        generatePermission(
          PermissionSubject.MANAGERS,
          Action.CREATE,
          PermissionSubjectTarget.ANY,
        ),
      ];
    case Role.MANAGER:
      return [
        generatePermission(
          PermissionSubject.USERS,
          Action.ANY,
          PermissionSubjectTarget.ANY,
        ),
        generatePermission(
          PermissionSubject.ADVERTS,
          Action.ANY,
          PermissionSubjectTarget.ANY,
        ),
      ];
    case Role.USER:
      return [
        generatePermission(
          PermissionSubject.USERS,
          Action.READ,
          PermissionSubjectTarget.SOME,
        ),
        generatePermission(
          PermissionSubject.USERS,
          Action.UPDATE,
          PermissionSubjectTarget.SOME,
        ),
        generatePermission(
          PermissionSubject.USERS,
          Action.DELETE,
          PermissionSubjectTarget.SOME,
        ),
        generatePermission(
          PermissionSubject.ADVERTS,
          Action.CREATE,
          PermissionSubjectTarget.ANY,
        ),
        generatePermission(
          PermissionSubject.ADVERTS,
          Action.READ,
          PermissionSubjectTarget.SOME,
        ),
        generatePermission(
          PermissionSubject.ADVERTS,
          Action.READ,
          PermissionSubjectTarget.ANY,
        ),
        generatePermission(
          PermissionSubject.ADVERTS,
          Action.UPDATE,
          PermissionSubjectTarget.SOME,
        ),
        generatePermission(
          PermissionSubject.ADVERTS,
          Action.DELETE,
          PermissionSubjectTarget.SOME,
        ),
      ];
    case Role.BUYER:
      return [
        generatePermission(
          PermissionSubject.ANY,
          Action.READ,
          PermissionSubjectTarget.ANY,
        ),
      ];
    default:
      throw new Error(`unsupported workspace role - ${role}`);
  }
}

export function generatePermission(
  subject: PermissionSubject,
  action: Action,
  target: PermissionSubjectTarget | string,
  effect = PermissionEffect.ALLOW,
): Permission {
  return {
    subject,
    action,
    target,
    effect,
  };
}
export function grantedMatchRequired(
  grantedPermissions: Permission[],
  requiredPermission: Permission,
): boolean {
  if (requiredPermission.effect !== PermissionEffect.ALLOW) {
    throw new Error('should only be used with ALLOW effect permissions');
  }

  const matchingPermissions = grantedPermissions.filter(
    (p) =>
      (p.subject === requiredPermission.subject ||
        p.subject === PermissionSubject.ANY) &&
      (p.action === requiredPermission.action || p.action === Action.ANY) &&
      (p.target === requiredPermission.target ||
        p.target === PermissionSubjectTarget.ANY),
  );

  if (!matchingPermissions.length) {
    return false;
  }

  return !matchingPermissions.some((p) => p.effect === PermissionEffect.DENY);
}
export function getPermittedSubjectIds(
  grantedPermissions: Permission[],
  requiredPermission: Permission,
  effect: PermissionEffect,
): string[] {
  return grantedPermissions
    .filter(
      (p) =>
        p.effect === effect &&
        [PermissionSubject.ANY, requiredPermission.subject].includes(
          p.subject,
        ) &&
        [Action.ANY, requiredPermission.action].includes(p.action),
    )
    .map((p) => p.target);
}
