import { Action } from '../enums/action.enum';
import { PermissionEffect } from '../enums/permission-effect.enum';
import { PermissionSubjectTarget } from '../enums/subject-target.enum';
import { PermissionSubject } from '../enums/subject-type.enum';

export abstract class Permission {
  readonly subject: PermissionSubject;

  readonly action: Action;
  readonly target: PermissionSubjectTarget | string;
  readonly effect: PermissionEffect;
}
