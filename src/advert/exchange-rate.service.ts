import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExchangeRateService {
  async fetchExchangeRates() {
    const response = await axios.get(
      'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=11',
    );
    return response.data;
  }
}
