import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Advert } from '../advert/advert.entity';
import { Role } from '../users/enum/role.enum';
import { User } from '../users/user.entity';
import { generateGlobalPermissions } from './permissions.helper';
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
    if (!user) {
      throw new ForbiddenException();
    }

    permissions.push(...generateGlobalPermissions(user.role));

    return { role: user.role, permissions };
  }
}
