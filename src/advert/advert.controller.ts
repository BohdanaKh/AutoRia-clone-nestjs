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

import { MailTemplate } from '../common/mail/mail.interface';
import { MailService } from '../common/mail/mail.service';
import { PublicAdvertInfoDto } from '../common/query/advert.query.dto';
import {
  Action,
  PermissionSubject,
  PermissionSubjectTarget,
  RequiresPermission,
} from '../permissions/decorators/permissions.decorator';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Account } from '../users/enum/account-type.enum';
import { User } from '../users/user.entity';
import { Advert } from './advert.entity';
import { AdvertService } from './advert.service';
import { CarValidationService } from './car-validation.service';
import { CreateAdvertDTO } from './dto/create.advert.dto';
import { UpdateAdvertDto } from './dto/update.advert.dto';

@ApiTags('Adverts')
@UseGuards(PermissionsGuard)
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
  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.READ,
    PermissionSubjectTarget.ANY,
  )
  async geAllAds(@Query() query: PublicAdvertInfoDto) {
    return this.advertService.getAllAds(query);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: CreateAdvertDTO })
  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.CREATE,
    PermissionSubjectTarget.SOME,
  )
  @Post('create/:userId')
  async createAdvert(
    @Req() req: any,
    @Param('userId') userId: string,
    @Body() body: CreateAdvertDTO,
  ): Promise<Advert> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.account !== Account.PREMIUM) {
      const adsLimit = 1;
      const adsCount = await this.advertService.getUserAdsCount(user);

      if (adsCount < adsLimit) {
        const selectedBrand = body.brand;
        const selectedModel = body.model;
        if (
          !this.carValidationService.isValidCarBrand(
            selectedBrand,
            selectedModel,
          )
        ) {
          await this.mailService.send(
            'admin@example.com',
            'Missing Car Brand Notification',
            MailTemplate.MISSING_BRAND_NOTIFICATION,
            { selectedBrand, selectedModel },
          );
          throw new BadRequestException(
            `Invalid car brand selected. Administration is informed about missing brand: ${selectedBrand}`,
          );
        }
        return await this.advertService.createAdvert(body, userId);
      } else {
        throw new BadRequestException(
          'Advertisement creation limit reached. Premium account required for advertisement creation.',
        );
      }
    } else {
      const selectedBrand = body.brand;

      const selectedModel = body.model;
      if (
        !this.carValidationService.isValidCarBrand(selectedBrand, selectedModel)
      ) {
        await this.mailService.send(
          'admin@example.com',
          'Missing Car Brand Notification',
          MailTemplate.MISSING_BRAND_NOTIFICATION,
          { selectedBrand, selectedModel },
        );
        throw new BadRequestException(
          `Invalid car brand selected. Administration is informed about missing brand: ${selectedBrand}`,
        );
      }
      return await this.advertService.createAdvert(body, userId);
    }
  }

  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.READ,
    PermissionSubjectTarget.SOME,
  )
  @Get(':advertId')
  async getAdvertWithUser(@Param('advertId') advertId: string) {
    return this.advertService.getAdvertWithUser(+advertId);
  }

  @UseGuards(AuthGuard())
  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.DELETE,
    PermissionSubjectTarget.SOME,
  )
  @Delete(':advertId')
  async deleteAdvert(@Param('advertId') advertId: string) {
    return this.advertService.deleteAdvert(advertId);
  }

  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.UPDATE,
    PermissionSubjectTarget.SOME,
  )
  @Patch(':advertId')
  async updateAdvert(
    @Param('advertId') advertId: string,
    @Body() body: UpdateAdvertDto,
  ) {
    return this.advertService.updateAdvert(advertId, body);
  }

  @UseGuards(AuthGuard())
  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.READ,
    PermissionSubjectTarget.SOME,
  )
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
  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.READ,
    PermissionSubjectTarget.SOME,
  )
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
  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.READ,
    PermissionSubjectTarget.SOME,
  )
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
  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.READ,
    PermissionSubjectTarget.SOME,
  )
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
  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.READ,
    PermissionSubjectTarget.SOME,
  )
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
  @RequiresPermission(
    PermissionSubject.ADVERTS,
    Action.READ,
    PermissionSubjectTarget.ANY,
  )
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
