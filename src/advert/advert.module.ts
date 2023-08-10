import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from '../casl/casl.module';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { AdvertController } from './advert.controller';
import { Advert } from './advert.entity';
import { AdvertRepository } from './advert.repository';
import { AdvertService } from './advert.service';
import { CarValidationService } from './car-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Advert, User]), UsersModule, CaslModule],
  providers: [
    AdvertService,
    AdvertRepository,
    UsersRepository,
    CarValidationService,
  ],
  controllers: [AdvertController],
})
export class AdvertModule {}
