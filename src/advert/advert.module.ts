import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';
import { AdvertController } from './advert.controller';

@Module({
  providers: [AdvertService],
  controllers: [AdvertController],
})
export class AdvertModule {}
