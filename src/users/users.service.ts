import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];
  constructor() {}

  async getAllUsers() {
    return this.users;
  }

  async createUser(data) {
    return this.users.push(data);
  }
}
