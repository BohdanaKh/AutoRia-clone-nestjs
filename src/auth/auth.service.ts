import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import process from 'process';
import { Repository } from 'typeorm';

import { UserloginDto } from '../users/dto/user.login.dto';
import { UserloginSocialDto } from '../users/dto/user.social.login.dto';
import { User } from '../users/user.entity';
import { JWTPayload } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
  ) {}
  async login(data: UserloginDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!findUser) {
      throw new HttpException(
        'Email or password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { password, ...result } = findUser;
    console.log(password);
    if (!(await this.compareHash(data.password, password))) {
      throw new HttpException(
        'Email or password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = await this.signIn(result);

    return { token };
  }

  async loginSocial(data: UserloginSocialDto) {
    try {
      const oAuthClient = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      );

      const result = await oAuthClient.verifyIdToken({
        idToken: data.accessToken,
      });

      const tokenPayload = result.getPayload();
      const token = await this.signInUser({ id: tokenPayload.sub });
      return { token };
    } catch (e) {
      throw new HttpException('Google auth failed', HttpStatus.UNAUTHORIZED);
    }
  }
  async signIn(data: JWTPayload): Promise<string> {
    return this.jwtService.signAsync(data);
  }

  async validateUser(data: JWTPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: data.id,
        role: data.role,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async verify(token: string): Promise<JWTPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (err) {
      console.log(new Date().toISOString(), token);
      throw new UnauthorizedException();
    }
  }

  decode(token: string): JWTPayload | any {
    try {
      return this.jwtService.decode(token);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(
        new Date().toISOString(),
        ' [JWT VERIFY ERROR] ',
        JSON.stringify(e),
        ' [TOKEN] ',
        token,
      );
    }
  }

  async signInUser(user) {
    return await this.signIn({
      id: user.id,
    });
  }
  //
  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
