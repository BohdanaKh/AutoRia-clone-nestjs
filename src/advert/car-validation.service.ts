import { Injectable } from '@nestjs/common';

import { AVAILABLE_CAR_BRANDS } from './interface/brands';

@Injectable()
export class CarValidationService {
  isValidCarBrand(brand: string): boolean {
    return AVAILABLE_CAR_BRANDS.includes(brand);
  }
}
