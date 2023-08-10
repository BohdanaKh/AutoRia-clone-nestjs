import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Action } from '../casl/action.enum';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policy.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { PublicAdvertInfoDto } from '../common/query/advert.query.dto';
import { User } from '../users/user.entity';
import { Advert } from './advert.entity';
import { AdvertService } from './advert.service';
import { CreateAdvertDTO } from './dto/create.advert.dto';
import { UpdateAdvertDto } from './dto/update.advert.dto';

@ApiTags('Adverts')
@Controller('adverts')
export class AdvertController {
  constructor(
    private readonly advertService: AdvertService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get('list')
  async geAllAds(@Query() query: PublicAdvertInfoDto) {
    return this.advertService.getAllAds(query);
  }

  @Post('create/:userId')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Advert))
  async createAdvert(
    @Param('userId') userId: string,
    @Body() body: CreateAdvertDTO,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const isPremium = user.isPremium;
    if (!isPremium) {
      const adsLimit = 1;
      const adsCount = await this.advertService.getUserAdsCount(userId);

      if (adsCount < adsLimit) {
        return this.advertService.createAdvert(userId, body);
      } else {
        return {
          message:
            'Advertisement creation limit reached. Premium account required for advertisement creation.',
        };
      }
    } else {
      return this.advertService.createAdvert(userId, body);
    }
  }

  @Get(':advertId')
  async getAdvertWithUser(@Param('advertId') advertId: string) {
    return this.advertService.getAdvertWithUser(+advertId);
  }

  @Delete(':advertId')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Advert))
  async deleteAdvert(@Param('advertId') advertId: string) {
    return this.advertService.deleteAdvert(advertId);
  }

  @Patch(':advertId')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Advert))
  async updateAdvert(
    @Param('advertId') advertId: string,
    @Body() body: UpdateAdvertDto,
  ) {
    return this.advertService.updateAdvert(advertId, body);
  }
}
