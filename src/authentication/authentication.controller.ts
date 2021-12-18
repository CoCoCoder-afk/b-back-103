import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get, ClassSerializerInterceptor, UseInterceptors, Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './jwt-refresh.guard';
import {LocalAuthenticationGuard} from "./localAuthentication.guard";

@Controller('/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('/login')
  async logIn(@Body() requestParams: any, @Req() request: any, @Res() response: any) {
    const { login } = requestParams;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(login);
    const {
      cookie: refreshTokenCookie,
      token: refreshToken
    } = this.authenticationService.getCookieWithJwtRefreshToken(login);

    await this.usersService.setCurrentRefreshToken(refreshToken, login);

    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    response.status(200).json({
      refresh: refreshToken
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('/logout')
  @HttpCode(200)
  async logOut(@Req() request: any) {
    await this.usersService.removeRefreshToken(request.login);
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookiesForLogOut());
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: any) {
    return request.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  refresh(@Req() request: any) {
    const { login } = request.body;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(login);
    const {
      cookie: refreshTokenCookie,
      token: refreshToken
    } = this.authenticationService.getCookieWithJwtRefreshToken(login);

    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return {
      refresh: refreshToken,
    }
  }
}
