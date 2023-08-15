import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  priceUSD: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  priceEUR: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userSpecifiedPrice: number;

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
  @ApiProperty()
  @IsOptional()
  views: Date[];
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPublished: boolean;
}
