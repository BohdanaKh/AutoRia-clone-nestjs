import {
  BadRequestException,
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
import {
  GetPremiumAccount,
  Premium,
} from '../common/decorators/premium.decorator';
import { PublicAdvertInfoDto } from '../common/query/advert.query.dto';
import { User } from '../users/user.entity';
import { Advert } from './advert.entity';
import { AdvertService } from './advert.service';
import { CarValidationService } from './car-validation.service';
import { CreateAdvertDTO } from './dto/create.advert.dto';
import { UpdateAdvertDto } from './dto/update.advert.dto';

@ApiTags('Adverts')
@Controller('adverts')
export class AdvertController {
  constructor(
    private readonly advertService: AdvertService,
    private readonly carValidationService: CarValidationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get('list')
  async geAllAds(@Query() query: PublicAdvertInfoDto) {
    return this.advertService.getAllAds(query);
  }

  @Post('create/:userId')
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Advert))
  async createAdvert(
    @Param('userId') userId: string,
    @Body() body: CreateAdvertDTO,
  ) {
    const selectedBrand = body.brand;

    if (!this.carValidationService.isValidCarBrand(selectedBrand)) {
      // Inform administration about the missing brand

      throw new BadRequestException(
        `Invalid car brand selected. Please inform administration about missing brand: ${selectedBrand}`,
      );
    }

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

  @Premium()
  @Get(':userId/:advertId/views')
  async getViews(
    @GetPremiumAccount() user: any,
    @Param('advertId') advertId: string,
  ) {
    if (user && user.isPremium) {
      return this.advertService.getViews(advertId);
    } else {
      return 'Access denied. Premium account required.';
    }
  }

  @Premium()
  @Get(':advertId/views_per_day')
  async getViewsPerDay(@Param('advertId') advertId: string) {
    return this.advertService.getViewsPerDay(advertId);
  }

  @Premium()
  @Get(':advertId/views_per_week')
  async getViewsPerWeek(@Param('advertId') advertId: string) {
    return this.advertService.getViewsPerWeek(advertId);
  }

  @Premium()
  @Get(':advertId/views_per_month')
  async getViewsPerMonth(@Param('advertId') advertId: string) {
    return this.advertService.getViewsPerMonth(advertId);
  }
  @Premium()
  @Get('average_price_by_region')
  async getAverageCarPriceByRegion(
    @GetPremiumAccount() user: any,
    @Param('advertId') advertId: string,
  ) {
    if (user && user.isPremium) {
      return this.advertService.getAveragePriceByRegion(advertId);
    } else {
      return 'Access denied. Premium account required.';
    }
  }
}
