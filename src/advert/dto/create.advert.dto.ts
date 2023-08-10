import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import IsNotProfanity from '../../common/decorators/censor-bad-words.decorator';
import Currency from '../interface/currency.enum';

export class CreateAdvertDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

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
  @IsOptional()
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
