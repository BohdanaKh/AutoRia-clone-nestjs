import { Injectable } from '@nestjs/common';

// import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { PaginatedDto } from '../common/pagination/response';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { Manager } from "./manager.entity";
import { ManagerCreateDto } from "./dto/manager.create.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  private salt = 7;
  constructor(
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  // async getAllUsers(
  //   query: PublicUserInfoDto,
  // ): Promise<PaginatedDto<PublicUserData>> {
  //   query.sort = query.sort || 'id';
  //   query.order = query.order || 'ASC';
  //   const options = {
  //     page: query.page || 1,
  //     limit: query.limit || 2,
  //   };
  //
  //   const queryBuilder = this.userRepository
  //     .createQueryBuilder('users')
  //     .innerJoin('users.advert', 'adv')
  //     .select('users.id, age, email, "userName"');
  //
  //   if (query.search) {
  //     queryBuilder.where('"userName" IN(:...search)', {
  //       search: query.search.split(','),
  //     });
  //   }
  //
  //   if (query.city) {
  //     queryBuilder.andWhere(
  //       `LOWER(adv.city) LIKE '%${query.city.toLowerCase()}%'`,
  //     );
  //   }
  //
  //   queryBuilder.orderBy(`"${query.sort}"`, query.order as 'ASC' | 'DESC');
  //
  //   const [pagination, rawResults] = await paginateRawAndEntities(
  //     queryBuilder,
  //     options,
  //   );
  //
  //   return {
  //     page: pagination.meta.currentPage,
  //     pages: pagination.meta.totalPages,
  //     countItem: pagination.meta.totalItems,
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     entities: rawResults as [PublicUserData],
  //   };
  // }

  async getAllUsers(query: PublicUserInfoDto): Promise<PaginatedDto<User>> {
    return await this.usersRepository.getAllUsers(query);
  }
  async createUser(data: UserCreateDto) {
    const newUser = await this.usersRepository.createUser(data);
    const token = await this.authService.signInUser(newUser);

    return { token };
  }
  async createManager(data: ManagerCreateDto) {
    const newUser = await this.usersRepository.createUser(data);
    const token = await this.authService.signInUser(newUser);

    return { token };
  }
  // async createUser(data: UserCreateDto) {
  //   const findUser = await this.usersRepository.findOne({
  //     where: { email: data.email },
  //   });
  //   if (findUser) {
  //     throw new HttpException(
  //       'User with this email already exists',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   data.password = await this.getHash(data.password);
  //   const newUser = this.usersRepository.create(data);
  //
  //   // const id = v4();
  //   // const newUser = this.userRepository.create({ id: id, ...data });
  //   // newUser.lastLogin = '12-07-2023';
  //   // await newUser.save();
  //   await this.usersRepository.save(newUser);
  //   const token = await this.singIn(newUser);
  //
  //   return { token };
  // }

  // async login(data: UserloginDto) {
  //   const findUser = await this.usersRepository.findOne({
  //     where: { email: data.email },
  //   });
  //   if (!findUser) {
  //     throw new HttpException(
  //       'Email or password is not correct',
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   if (!(await this.compareHash(data.password, findUser.password))) {
  //     throw new HttpException(
  //       'Email or password is not correct',
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   const token = await this.singIn(findUser);
  //
  //   return { token };
  // }

  async getOneUser(userId: string) {
    return await this.usersRepository.findOne({
      where: { id: userId },
      relations: { adverts: true },
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
  async getHash(password: string) {
    return await bcrypt.hash(password, this.salt);
  }
}
