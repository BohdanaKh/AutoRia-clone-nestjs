import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { IsPremium } from '../common/decorators/isPremium.decorator';
import { MailTemplate } from '../common/mail/mail.interface';
import { MailService } from '../common/mail/mail.service';
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
    private readonly mailService: MailService,
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
    const user = await this.userRepository.findOneBy({ id: userId });
    console.log(user);
    const isPremium = user.isPremium;
    console.log(isPremium);
    if (isPremium === false) {
      const adsLimit = 1;
      const adsCount = await this.advertService.getUserAdsCount(user);

      if (adsCount < adsLimit) {
        const selectedBrand = body.brand;
        console.log(selectedBrand);

        if (!this.carValidationService.isValidCarBrand(selectedBrand)) {
          await this.mailService.send(
            'dananvm@gmail.com',
            'Missing Car Brand Notification',
            MailTemplate.MISSING_BRAND_NOTIFICATION,
            { selectedBrand },
          );
          throw new BadRequestException(
            `Invalid car brand selected. Administration is informed about missing brand: ${selectedBrand}`,
          );
        }
        return this.advertService.createAdvert(body, user);
      } else {
        return {
          message:
            'Advertisement creation limit reached. Premium account required for advertisement creation.',
        };
      }
    } else {
      const selectedBrand = body.brand;

      if (!this.carValidationService.isValidCarBrand(selectedBrand)) {
        await this.mailService.send(
          'dananvm@gmail.com',
          'Missing Car Brand Notification',
          MailTemplate.MISSING_BRAND_NOTIFICATION,
          { selectedBrand },
        );
        throw new BadRequestException(
          `Invalid car brand selected. Administration is informed about missing brand: ${selectedBrand}`,
        );
      }
      return this.advertService.createAdvert(body, user);
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

  @Get(':userId/:advertId/views')
  async getViews(
    @Param('userId') userId: string,
    @IsPremium() isPremium: boolean,
    @Param('advertId') advertId: string,
  ) {
    const entity = await this.userRepository.findOneBy({ id: userId });
    if (entity.isPremium) {
      return this.advertService.getViews(advertId);
    } else {
      return 'Access denied. Premium account required.';
    }
  }

  @Get(':userId/:advertId/views_per_day')
  async getViewsPerDay(
    @Param('userId') userId: string,
    @IsPremium() isPremium: boolean,
    @Param('advertId') advertId: string,
  ) {
    const entity = await this.userRepository.findOneBy({ id: userId });
    if (entity.isPremium) {
      return this.advertService.getViewsPerDay(advertId);
    }
  }

  @Get('userId/:advertId/views_per_month')
  async getViewsPerMonth(
    @Param('userId') userId: string,
    @IsPremium() isPremium: boolean,
    @Param('advertId') advertId: string,
  ) {
    if (isPremium) {
      return this.advertService.getViewsPerMonth(advertId);
    }
  }

  @Get(':userId/:advertId/average_price_by_region')
  async getAverageCarPriceByRegion(
    @Param('userId') userId: string,
    @Param('advertId') advertId: string,
  ) {
    const entity = await this.userRepository.findOneBy({ id: userId });
    if (entity.isPremium) {
      return this.advertService.getAveragePriceByRegion(advertId);
    } else {
      return 'Access denied. Premium account required.';
    }
  }

  @Get(':userId/average_price')
  async getAveragePriceOfCars(
    @Param('userId') userId: string,
  ): Promise<number> {
    const entity = await this.userRepository.findOneBy({ id: userId });
    if (entity.isPremium) {
      return await this.advertService.getAveragePriceOfCars();
    } else {
      throw new HttpException(
        'Access denied. Premium account required.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
