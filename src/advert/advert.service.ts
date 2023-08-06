import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advert } from './advert.entity';
import { FilterAdvertDto } from './dto/filter.advert.dto';
import { CreateAdvertDTO } from './dto/create.advert.dto';

@Injectable()
export class AdvertService {
  // constructor(
  //   @InjectRepository(Advert)
  //   private readonly advertRepository: Repository<Advert>,
  // ) {}

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
  // async getAllAdverts() {
  //   return this.adverts;
  // }
  //
  // async getAdvert(id: string) {
  //   const advert = this.adverts.find((item) => item.id.toString() === id);
  //   console.log(advert);
  //   return advert;
  // }
  //
  // async addAdvert(createAdvertDTO: CreateAdvertDTO) {
  //   return this.adverts.push({
  //     id: this.adverts.length + 1,
  //     ...createAdvertDTO,
  //   });
  // }
  //
  // async updateAdvert(id: string, createAdvertDTO: CreateAdvertDTO) {
  //   const updatedAdvert = this.adverts.find(
  //     (item) => item.id.toString() === id,
  //   );
  //   // @ts-ignore
  //   updatedAdver = { id: +id, createAdverDTO };
  //   return updatedAdvert;
  // }
  //
  // async deleteAdvert(id: string) {
  //   const deletedAdvert = this.adverts.find(
  //     (item) => item.id.toString() === id,
  //   );
  //   const i = this.adverts.indexOf(deletedAdvert);
  //   return this.adverts.splice(i, 1);
  // }
}
