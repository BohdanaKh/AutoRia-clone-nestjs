import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { PaginatedDto } from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async getAllUsers(query: PublicUserInfoDto): Promise<PaginatedDto<User>> {
    return await this.usersRepository.getAllUsers(query);
  }
  async createUser(data: UserCreateDto) {
    const newUser = await this.usersRepository.createUser(data);
    const token = await this.authService.signInUser(newUser);

    return { token };
  }

  async getOneUser(userId: string) {
    return await this.usersRepository.findOne({
      where: { id: userId },
    });
  }

  async update(userId, data: UserUpdateDto) {
    await this.usersRepository.findOne({
      where: { id: userId },
    });
    return await this.usersRepository.update({ id: userId }, { ...data });
  }

  async delete(userId: string) {
    return await this.usersRepository.delete({ id: userId });
  }
}
