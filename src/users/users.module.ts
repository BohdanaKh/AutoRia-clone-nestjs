import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { CaslAbilityFactory } from "../casl/casl-ability.factory/casl-ability.factory";
import { CaslModule } from "../casl/casl.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, CaslModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, CaslAbilityFactory],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
