import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import IsNotProfanity from '../../common/decorators/censor-bad-words.decorator';

export class CreateAdvertDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  priceUAH: number;

  priceUSD: { rate: number; price: number };

  priceEUR: { rate: number; price: number };

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNotProfanity('categories')
  categories: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNotProfanity('brand')
  brand: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNotProfanity('model')
  model: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNotProfanity('modification')
  modification: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNotProfanity('body')
  body: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  mileage: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNotProfanity('region')
  region: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNotProfanity('city')
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNotProfanity('photo')
  photo: string;

  views: Date[];
  isPublished: boolean;
}
