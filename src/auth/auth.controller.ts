import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

import { UserloginDto } from '../users/dto/user.login.dto';
import { UserloginSocialDto } from '../users/dto/user.social.login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // @Post('/register')
  // async register(@Body() createUserDTO: UserCreateDto) {
  //   const user = await this.usersService.createUser(createUserDTO);
  //   return user;
  // }

  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // async login(@Request() req) {
  //   return this.usersService.login(req.user);
  // }
  //
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Manager, Role.Admin)
  // @Get('/user')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
  //
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Get('/admin')
  // getDashboard(@Request() req) {
  //   return req.user;
  // }
  @Post('login')
  async loginUser(@Body() body: UserloginDto) {
    return this.authService.login(body);
  }

  @Post('social/login')
  async loginSocialUser(@Body() body: UserloginSocialDto) {
    return this.authService.loginSocial(body);
  }
}
