import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedDto } from '../common/pagination/response';
import { PublicAdvertInfoDto } from '../common/query/advert.query.dto';
import { User } from '../users/user.entity';
import { Advert } from './advert.entity';
import { AdvertRepository } from './advert.repository';
import { CreateAdvertDTO } from './dto/create.advert.dto';
import { UpdateAdvertDto } from './dto/update.advert.dto';

@Injectable()
export class AdvertService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly adsRepository: AdvertRepository,
  ) {}

  async getUserAdsCount(userId: string): Promise<number> {
    console.log(userId);
    return await this.adsRepository.countBy({});
  }

  async createAdvert(userId: string, data: CreateAdvertDTO): Promise<Advert> {
    return this.adsRepository.createAdvert(userId, data);
  }

  async getAdvertWithUser(advertId: number): Promise<Advert> {
    return await this.adsRepository.findOne({
      where: { id: advertId },
      relations: { user: true },
    });
  }

  // async getFilteredAdverts(filterAdvertDTO: FilterAdvertDto): Promise<any> {
  //   const { category, search } = filterAdvertDTO;
  //   let adverts = await this.getAllAdverts();
  //
  //   if (search) {
  //     adverts = adverts.filter(
  //       (advert) =>
  //         advert.name.includes(search) || advert.description.includes(search),
  //     );
  //   }
  //
  //   if (category) {
  //     adverts = adverts.filter((advert) => advert.category === category);
  //   }
  //
  //   return adverts;
  // }
  //
  async getAllAds(query: PublicAdvertInfoDto): Promise<PaginatedDto<Advert>> {
    return await this.adsRepository.getAllAds(query);
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
}
