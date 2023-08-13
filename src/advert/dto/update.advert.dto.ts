import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAdvertDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  year: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  priceUAH: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  priceUSD: { rate: number; price: number };

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  priceEUR: { rate: number; price: number };

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
  @IsOptional()
  views: Date[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPublished: boolean;
}
