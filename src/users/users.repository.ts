import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from './user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  private salt = 7;
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.manager);
  }
  public async getAllUsers(query: PublicUserInfoDto) {
    query.order = query.order || 'ASC';

    const page = +query.page || 1;
    const limit = +query.limit || 10;
    const offset = (page - 1) * limit;

    const queryBuilder = this.createQueryBuilder('users');

    if (query.search) {
      queryBuilder.where('"userName" IN(:...search)', {
        search: query.search.split(','),
      });
    }

    queryBuilder.limit(limit);
    queryBuilder.offset(offset);
    const [entities, count] = await queryBuilder.getManyAndCount();

    return {
      page,
      pages: Math.ceil(count / limit),
      countItem: count,
      entities,
    };
  }

  async createUser(data: UserCreateDto): Promise<User> {
    const findUser = await this.findOne({
      where: { email: data.email },
    });
    if (findUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    data.password = await this.getHash(data.password);
    return this.save(data);
  }
  async getHash(password: string) {
    return await bcrypt.hash(password, this.salt);
  }
}
