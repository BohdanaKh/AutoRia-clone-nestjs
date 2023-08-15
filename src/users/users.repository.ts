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
    const limit = +query.limit || 4;
    const offset = (page - 1) * limit;

    // const queryBuilder = this.createQueryBuilder('users').leftJoinAndSelect(
    //   'users.adverts',
    //   'advert',
    // );
    const queryBuilder = this.createQueryBuilder('users');

    if (query.search) {
      queryBuilder.where('"userName" IN(:...search)', {
        search: query.search.split(','),
      });
    }

    // if (query.class) {
    //   queryBuilder.andWhere(`LOWER(ani.class) LIKE '%:class%'`, {
    //     class: query.class.toLowerCase(),
    //   });
    // }

    // switch (query.sort) {
    //   case 'userName':
    //     queryBuilder.orderBy('user.userName', query.order);
    //     break;
    //   case 'age':
    //     queryBuilder.orderBy('user.age', query.order);
    //     break;
    //   case 'city':
    //     queryBuilder.orderBy('user.city', query.order);
    //     break;
    //   case 'animalName':
    //     queryBuilder.orderBy('animal.name', query.order);
    //     break;
    //   default:
    //     queryBuilder.orderBy('user.id', query.order);
    // }

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

    // const id = v4();
    // const newUser = this.userRepository.create({ id: id, ...data });
    // newUser.lastLogin = '12-07-2023';
    // await newUser.save();
    // await this.save(newUser);
    // const token = await this.singIn(newUser);
    //
    // return { token };
  }

  // async createManager(data: ManagerCreateDto) {
  //   const findUser = await this.findOne({
  //     where: { email: data.email },
  //   });
  //   if (findUser) {
  //     throw new HttpException(
  //       'User with this email already exists',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   data.password = await this.usersService.getHash(data.password);
  //   return this.save(data);
  // }

  // async login(data: UserloginDto) {
  //   return await this.findOne({
  //     where: { email: data.email },
  //   });
  // if (!findUser) {
  //   throw new HttpException(
  //     'Email or password is not correct',
  //     HttpStatus.UNAUTHORIZED,
  //   );
  // }
  // if (!(await this.compareHash(data.password, findUser.password))) {
  //   throw new HttpException(
  //     'Email or password is not correct',
  //     HttpStatus.UNAUTHORIZED,
  //   );
  // }
  // const token = await this.singIn(findUser);
  //
  // return { token };
  // }

  // async singIn(user) {
  //   return await this.authService.signIn({
  //     id: user.id.toString(),
  //   });
  // }

  // async compareHash(password: string, hash: string): Promise<boolean> {
  //   return bcrypt.compare(password, hash);
  // }

  async getHash(password: string) {
    return await bcrypt.hash(password, this.salt);
  }
}
