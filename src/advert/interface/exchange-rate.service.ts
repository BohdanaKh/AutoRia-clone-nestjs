import { Injectable } from '@nestjs/common';
import axios from 'axios';

import Currency from './currency.enum';

@Injectable()
export class ExchangeRateService {
  async fetchExchangeRates(): Promise<{ [key in Currency]: number }> {
    const response = await axios.get(
      'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=11',
    );
    return response.data;
    console.log(response.data);
  }
}
