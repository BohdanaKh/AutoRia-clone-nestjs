import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdvertModule } from './advert/advert.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './common/mail.module';
import { TypeOrmConfiguration } from './config/database/type-orm-configuration';
import { PermissionsController } from './permissions/permissions.controller';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfiguration.config),
    UsersModule,
    AdvertModule,
    AuthModule,
    MailModule,
    ScheduleModule.forRoot(),
    PermissionsModule,
  ],
  controllers: [AppController, PermissionsController],
  providers: [AppService],
})
export class AppModule {}
