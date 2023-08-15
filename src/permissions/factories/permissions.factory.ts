import { PERMISSIONS, Permissions } from './permissions';

export const PermissionsFactory = {
  provide: PERMISSIONS,
  useFactory: (permissions: Permissions): Permissions => {
    return permissions;
  },
  inject: [Permissions],
};
