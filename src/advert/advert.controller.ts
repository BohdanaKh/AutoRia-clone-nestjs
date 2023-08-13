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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Action } from '../casl/action.enum';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { CheckPolicies } from '../casl/check-policy.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { MailTemplate } from '../common/mail/mail.interface';
import { MailService } from '../common/mail/mail.service';
import { PublicAdvertInfoDto } from '../common/query/advert.query.dto';
import { Account } from '../users/enum/account-type.enum';
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

  @ApiResponse({ status: HttpStatus.CREATED, type: CreateAdvertDTO })
  @Post('create/:userId')
  @UseGuards(AuthGuard())
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Advert))
  async createAdvert(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body() body: CreateAdvertDTO,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    console.log(user);
    if (user.account !== Account.PREMIUM) {
      const adsLimit = 1;
      const adsCount = await this.advertService.getUserAdsCount(user);

      if (adsCount < adsLimit) {
        const selectedBrand = body.brand;
        console.log(selectedBrand);

        if (!this.carValidationService.isValidCarBrand(selectedBrand)) {
          await this.mailService.send(
            'admin@example.com',
            'Missing Car Brand Notification',
            MailTemplate.MISSING_BRAND_NOTIFICATION,
            { selectedBrand },
          );
          throw new BadRequestException(
            `Invalid car brand selected. Administration is informed about missing brand: ${selectedBrand}`,
          );
        }
        return await this.advertService.createAdvert(body, user);
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
      return await this.advertService.createAdvert(body, user);
    }
  }

  @Get(':advertId')
  async getAdvertWithUser(@Param('advertId') advertId: string) {
    return this.advertService.getAdvertWithUser(+advertId);
  }

  @UseGuards(AuthGuard())
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

  @UseGuards(AuthGuard())
  @Get(':userId/:advertId/views')
  async getViews(
    @Param('userId') userId: string,
    @Param('advertId') advertId: string,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.account === Account.PREMIUM) {
      return this.advertService.getViews(advertId);
    } else {
      throw new HttpException(
        'Access denied. Premium account required.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard())
  @Get(':userId/:advertId/views_per_day')
  async getViewsPerDay(
    @Param('userId') userId: string,
    @Param('advertId') advertId: string,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.account === Account.PREMIUM) {
      return this.advertService.getViewsPerDay(advertId);
    } else {
      throw new HttpException(
        'Access denied. Premium account required.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard())
  @Get(':userId/:advertId/views_per_week')
  async getViewsPerWeek(
    @Param('userId') userId: string,
    @Param('advertId') advertId: string,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.account === Account.PREMIUM) {
      return this.advertService.getViewsPerWeek(advertId);
    } else {
      throw new HttpException(
        'Access denied. Premium account required.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard())
  @Get('userId/:advertId/views_per_month')
  async getViewsPerMonth(
    @Param('userId') userId: string,
    @Param('advertId') advertId: string,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.account === Account.PREMIUM) {
      return this.advertService.getViewsPerMonth(advertId);
    } else {
      throw new HttpException(
        'Access denied. Premium account required.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard())
  @Get(':userId/average_price_by_region')
  async getAverageCarPriceByRegion(
    @Param('userId') userId: string,
    @Query() query: PublicAdvertInfoDto,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.account === Account.PREMIUM) {
      return this.advertService.getAveragePriceByRegion(query);
    } else {
      throw new HttpException(
        'Access denied. Premium account required.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard())
  @Get(':userId/average_price')
  async getAveragePrice(
    @Param('userId') userId: string,
    @Query() query: PublicAdvertInfoDto,
  ): Promise<number> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.account === Account.PREMIUM) {
      return await this.advertService.getAveragePrice(query);
    } else {
      throw new HttpException(
        'Access denied. Premium account required.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
