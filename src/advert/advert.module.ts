import { Module } from '@nestjs/common';
import { AdvertService } from './advert.service';

@Module({
  providers: [AdvertService]
})
export class AdvertModule {}
