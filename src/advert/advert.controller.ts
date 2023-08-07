import { Controller, Post } from '@nestjs/common';

@Controller('advert')
export class AdvertController {
  constructor() {}

  @Post(':userId/create')
  // check if user exists
  async createAdvertForUser() {}
}
