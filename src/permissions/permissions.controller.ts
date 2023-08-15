import { Controller, Get, Param } from '@nestjs/common';

import { PermissionsService } from './permissions.service';
import { Permission } from './types/permission.type';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('/:userId')
  async getManyForCurrentUser(
    @Param('userId') userId: string,
  ): Promise<Permission[]> {
    const { permissions } = await this.permissionsService.getMany(userId);

    return permissions;
  }
}
