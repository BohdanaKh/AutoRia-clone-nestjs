import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedDto } from '../common/pagination/response';
import { PublicAdvertInfoDto } from '../common/query/advert.query.dto';
import { User } from '../users/user.entity';
import { Advert } from './advert.entity';
import { AdvertRepository } from './advert.repository';
import { CreateAdvertDTO } from './dto/create.advert.dto';
import { UpdateAdvertDto } from './dto/update.advert.dto';
import { ExchangeRateService } from './exchange-rate.service';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly adsRepository: AdvertRepository,
    private readonly httpService: HttpService,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async createAdvert(data: CreateAdvertDTO, userId: string): Promise<Advert> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const exchangeRates = await this.exchangeRateService.fetchExchangeRates();
    const rates = exchangeRates.map((rate) => rate.sale);
    const calculatedPriceUSD = {
      rate: rates[1],
      price: (data.priceUAH / rates[1]).toFixed(2),
    };
    const calculatedPriceEUR = {
      rate: rates[0],
      price: (data.priceUAH / rates[0]).toFixed(2),
    };
    return await this.adsRepository.createAdvert(
      data,
      calculatedPriceEUR,
      calculatedPriceUSD,
      user,
    );
  }

  async getAllAds(query: PublicAdvertInfoDto): Promise<PaginatedDto<Advert>> {
    return await this.adsRepository.getAllAds(query);
  }

  async getAdvertWithUser(advertId: number): Promise<Advert> {
    const advert = await this.adsRepository.findOne({
      where: { id: advertId },
      relations: { user: true },
    });
    advert.views.push(new Date());
    await this.adsRepository.save(advert);
    return advert;
  }

  async getUserAdsCount(user): Promise<number> {
    return await this.adsRepository.countBy({ user: user });
  }

  async updateAdvert(advertId: string, updateAdvertDTO: UpdateAdvertDto) {
    await this.adsRepository.findOne({
      where: { id: +advertId },
    });
    return await this.adsRepository.update(
      { id: +advertId },
      { ...updateAdvertDTO },
    );
  }

  async deleteAdvert(advertId: string) {
    return await this.adsRepository.delete({ id: +advertId });
  }

  async getViews(advertId: string): Promise<number> {
    return await this.adsRepository.countAllViews({ id: +advertId });
  }
  async getViewsPerDay(advertId: string): Promise<number> {
    return this.adsRepository.countViewsPerTimeframe(advertId, 'day');
  }

  async getViewsPerWeek(advertId: string): Promise<number> {
    return this.adsRepository.countViewsPerTimeframe(advertId, 'week');
  }

  async getViewsPerMonth(advertId: string): Promise<number> {
    return this.adsRepository.countViewsPerTimeframe(advertId, 'month');
  }
  async getAveragePriceByRegion(query: PublicAdvertInfoDto): Promise<number> {
    return await this.adsRepository.getAveragePriceByRegion(query);
  }

  async getAveragePrice(query: PublicAdvertInfoDto): Promise<number> {
    return await this.adsRepository.getAveragePrice(query);
  }
  async calculateAndUpdatePrices() {
    const exchangeRates = await this.exchangeRateService.fetchExchangeRates();

    const adsWithOriginalPrices = await this.adsRepository.find();
    adsWithOriginalPrices.map((advert) => {
      const rates = exchangeRates.map((rate) => rate.sale);
      const calculatedAmountEUR = {
        rate: rates[0],
        price: advert.userSpecifiedPrice / rates[0],
      };
      const calculatedAmountUSD = {
        rate: rates[1],
        price: advert.userSpecifiedPrice / rates[1],
      };
      return this.adsRepository.save({
        ...advert,
        priceUSD: calculatedAmountUSD,
        priceEUR: calculatedAmountEUR,
      });
    });
  }
  @Cron('0 0 * * *')
  async updatePricesDaily() {
    await this.calculateAndUpdatePrices();
  }
}
