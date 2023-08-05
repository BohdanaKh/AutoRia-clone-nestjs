import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AdvertController } from './advert/advert.controller';
import { AdvertModule } from './advert/advert.module';
import { UsersService } from './users/users.service';
import { TypeOrmConfiguration } from './config/database/type-orm-configuration';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfiguration.config),
    UsersModule,
    AdvertModule,
  ],
  controllers: [AppController, UsersController, AdvertController],
  providers: [AppService, UsersService],
})
export class AppModule {}
