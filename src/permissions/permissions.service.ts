import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Advert } from '../advert/advert.entity';
import { User } from '../users/user.entity';
// import { Action } from './enums/action.enum';
import Role from './enums/role.enum';
// import { PermissionSubject } from './enums/subject-type.enum';
import {
  generateGlobalPermissions,
  // generatePermission,
} from './permissions.helper';
import { Permission } from './types/permission.type';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Advert)
    private readonly adsRepository: Repository<Advert>,
  ) {}

  async getMany(
    userId: string,
  ): Promise<{ role: Role; permissions: Permission[] }> {
    const permissions = [];

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    console.log(user.role);
    if (!user) {
      throw new ForbiddenException();
    }

    permissions.push(...generateGlobalPermissions(user.role));

    // if (user.role === Role.USER) {
    //   user.adverts.forEach((advert) =>
    //     permissions.push(
    //       ...[
    //         generatePermission(
    //           PermissionSubject.ADVERTS,
    //           Action.UPDATE,
    //           advert.id.toString(),
    //         ),
    //         generatePermission(
    //           PermissionSubject.ADVERTS,
    //           Action.DELETE,
    //           advert.id.toString(),
    //         ),
    //       ],
    //     ),
    //   );
    // }

    return { role: user.role, permissions };
  }
}
