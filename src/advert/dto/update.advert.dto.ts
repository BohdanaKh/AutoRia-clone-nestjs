import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import Currency from '../currency.enum';

export class UpdateAdvertDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  year: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsEnum(Currency)
  @IsOptional()
  currency: Currency;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categories: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  brand: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  model: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  modification: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  body: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  mileage: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  region: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  photo: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  views: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPublished: boolean;
}
