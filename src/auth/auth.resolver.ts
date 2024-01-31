import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { LoginResponse } from './types/login-response.type';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AccessAuthGuard } from '../utils/guards/auth/access-auth.guard';
import { RefreshAuthGuard } from '../utils/guards/auth/refresh-auth-guard';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { SoftDeleteResult } from '../utils/types/delete-result.type';
import { AuthRegisterResponseDto } from './dto/auth-register-response.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { CurrentSession, CurrentUser, Public } from '@NibrasoftNet/linkbook-commons';
import { RolesGuard } from '../roles/roles.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}


  @Public()
  @Mutation(() => AuthRegisterResponseDto, { name: 'registerUser' })
  async registerUser(@Args('authRegisterLoginDto') authRegisterLoginDto: AuthRegisterLoginDto): Promise<AuthRegisterResponseDto> {
    try {
      return await this.authService.registerUser(authRegisterLoginDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Public()
  @Mutation(() => Boolean, { name: 'confirmEmail' })
  async confirmEmail(@Args('confirmEmailDto') confirmEmailDto: ConfirmEmailDto): Promise<boolean> {
    try {
      return await this.authService.confirmEmail(confirmEmailDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Public()
  @Mutation(() => AuthRegisterResponseDto, { name: 'resendOtp' })
  async resendOtp(@Args('resendOtpDto') resendOtpDto: ResendOtpDto): Promise<AuthRegisterResponseDto> {
    try {
      return await this.authService.resendOtp(resendOtpDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Public()
  @Mutation(() => LoginResponse, { name: 'loginByEmail' })
  async loginByEmail(@Args('authEmailLoginDto') authEmailLoginDto: AuthEmailLoginDto): Promise<LoginResponse> {
    try {
      return this.authService.validateLogin(authEmailLoginDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @UseGuards(RefreshAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Query(() => LoginResponse, { name: 'refresh' })
  async refresh(@CurrentSession() session: JwtRefreshPayloadType): Promise<Omit<LoginResponse, 'user'>> {
    try {
      console.log('ssssss', session);
      return this.authService.refreshToken(session);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @UseGuards(AccessAuthGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Query(() => User)
  async findMe(@CurrentUser() user: JwtPayloadType): Promise<User> {
    console.log('qwerty', user);
    return await this.authService.findMe(user);
  }

  @UseGuards(RefreshAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Query(() => SoftDeleteResult)
  async logout(@CurrentSession() session: JwtRefreshPayloadType): Promise<SoftDeleteResult> {
    return await this.authService.logout(session);
  }


/*  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Query(() => User)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }

  @Mutation(() => User)
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }*/
}
