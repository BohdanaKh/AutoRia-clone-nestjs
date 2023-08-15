import { Injectable } from '@nestjs/common';

import { AVAILABLE_CAR_BRANDS } from './interface/brands';

@Injectable()
export class CarValidationService {
  isValidCarBrand(brand: string, model: string): boolean {
    return !!AVAILABLE_CAR_BRANDS.find(
      (car) => car.brand === brand && car.model === model,
    );
  }
}
