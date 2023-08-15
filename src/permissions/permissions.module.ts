import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Advert } from '../advert/advert.entity';
import { User } from '../users/user.entity';
import { PERMISSIONS, Permissions } from './factories/permissions';
import { PermissionsFactory } from './factories/permissions.factory';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Advert, User])],
  providers: [PermissionsService, Permissions, PermissionsFactory],
  controllers: [PermissionsController],
  exports: [PermissionsService, PERMISSIONS],
})
export class PermissionsModule {}
