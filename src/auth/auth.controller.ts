import { Body, Controller, Post } from '@nestjs/common';

import { UserLoginDto } from '../users/dto/user.login.dto';
import { UserLoginSocialDto } from '../users/dto/user.social.login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async loginUser(@Body() body: UserLoginDto) {
    return this.authService.login(body);
  }

  @Post('social/login')
  async loginSocialUser(@Body() body: UserLoginSocialDto) {
    return this.authService.loginSocial(body);
  }
}
