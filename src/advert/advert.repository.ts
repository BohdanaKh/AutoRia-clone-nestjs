import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { DataSource, Repository } from 'typeorm';

import { PublicAdvertInfoDto } from '../common/query/advert.query.dto';
import { UsersRepository } from '../users/users.repository';
import { Advert } from './advert.entity';
import { CreateAdvertDTO } from './dto/create.advert.dto';

@Injectable()
export class AdvertRepository extends Repository<Advert> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UsersRepository,
  ) {
    super(Advert, dataSource.manager);
  }

  public async getAllAds(query: PublicAdvertInfoDto) {
    query.order = query.order || 'ASC';
    const page = +query.page || 1;
    const limit = +query.limit || 2;
    const offset = (page - 1) * limit;

    const queryBuilder = this.createQueryBuilder('adverts').leftJoinAndSelect(
      'adverts.user',
      'user',
    );

    if (query.search) {
      queryBuilder.where('"brand" IN(:...search)', {
        search: query.search.split(','),
      });
    }

    if (query.categories) {
      queryBuilder.andWhere(`LOWER(ani.categories) LIKE '%:categories%'`, {
        categories: query.categories.toLowerCase(),
      });
    }

    // switch (query.sort) {
    //   case 'brand':
    //     queryBuilder.orderBy('advert.brand', query.order);
    //     break;
    //   case 'year':
    //     queryBuilder.orderBy('advert.year', query.order);
    //     break;
    //   case 'city':
    //     queryBuilder.orderBy('advert.city', query.order);
    //     break;
    //   // case 'animalName':
    //   //   queryBuilder.orderBy('animal.name', query.order);
    //   //   break;
    //   default:
    //     queryBuilder.orderBy('advert.id', query.order);
    // }
    queryBuilder.limit(limit);
    queryBuilder.offset(offset);
    const [entities, count] = await queryBuilder.getManyAndCount();

    return {
      page,
      pages: Math.ceil(count / limit),
      countItem: count,
      entities,
    };
  }

  async createAdvert(userId: string, data: CreateAdvertDTO) {
    const user = await this.userRepository.findOneBy({});
    return await this.save({ ...data, user: user });
  }

  //   async findOne(advertId) {
  //     const user = await this.userRepository.findOneBy({});
  //     return await this.findOne({ advertId, user: user });

  async countAllViews(advertId): Promise<number> {
    const advert = await this.findOneBy(advertId);
    let totalViews = 0;
    totalViews += advert.views.length;
    return totalViews;
  }
  async countViewsPerTimeframe(
    advertId,
    timeframe: 'day' | 'week' | 'month',
  ): Promise<number> {
    const advert = await this.findOneBy(advertId);
    const now = dayjs();
    const timeframeMap = {
      day: 'day',
      week: 'week',
      month: 'month',
    };

    let viewsCount = 0;
    const viewsWithinTimeframe = advert.views.filter((view) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dayjs(view).isAfter(now.subtract(1, timeframeMap[timeframe])),
    );
    viewsCount += viewsWithinTimeframe.length;
    return viewsCount;
  }

  async getAveragePriceByRegion(advertId): Promise<any> {
    const averagePrice = await this.createQueryBuilder('advert', advertId)
      .select('advert.region', 'region')
      .addSelect('AVG(advert.price)', 'averagePrice')
      .groupBy('advert.region')
      .getRawMany();

    return averagePrice;
  }
}
