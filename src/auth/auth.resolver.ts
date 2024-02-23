import { AccessAuthGuard } from '../utils/guards/auth/access-auth.guard';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthRegisterResponseDto } from './dto/auth-register-response.dto';
import { AuthService } from './auth.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import {
	CurrentSession,
	CurrentUser,
	Public,
} from '@NibrasoftNet/linkbook-commons';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { LoginResponse } from './types/login-response.type';
import { RefreshAuthGuard } from '../utils/guards/auth/refresh-auth-guard';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { SoftDeleteResult } from '../utils/types/delete-result.type';
import { UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Resolver(() => User)
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Mutation(() => AuthRegisterResponseDto, { name: 'registerUser' })
	async registerUser(
		@Args('authRegisterLoginDto')
		authRegisterLoginDto: AuthRegisterLoginDto,
	): Promise<AuthRegisterResponseDto> {
			return await this.authService.registerUser(authRegisterLoginDto);

	}

	@Public()
	@Mutation(() => Boolean, { name: 'confirmEmail' })
	async confirmEmail(
		@Args('confirmEmailDto') confirmEmailDto: ConfirmEmailDto,
	): Promise<boolean> {
			return await this.authService.confirmEmail(confirmEmailDto);
	}

	@Public()
	@Mutation(() => AuthRegisterResponseDto, { name: 'resendOtp' })
	async resendOtp(
		@Args('resendOtpDto') resendOtpDto: ResendOtpDto,
	): Promise<AuthRegisterResponseDto> {
			return await this.authService.resendOtp(resendOtpDto);
	}

	@Public()
	@Mutation(() => LoginResponse, { name: 'loginByEmail' })
	async loginByEmail(
		@Args('authEmailLoginDto') authEmailLoginDto: AuthEmailLoginDto,
	): Promise<LoginResponse> {
			return await this.authService.validateLogin(authEmailLoginDto);
	}

	@UseGuards(RefreshAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.USER)
	@Query(() => LoginResponse, { name: 'refresh' })
	async refresh(
		@CurrentSession() session: JwtRefreshPayloadType,
	): Promise<Omit<LoginResponse, 'user'>> {
			console.log('ssssss', session);
			return await this.authService.refreshToken(session);
	}

	@UseGuards(AccessAuthGuard)
	@Roles(RoleEnum.USER, RoleEnum.ADMIN)
	@Query(() => User)
	async findMe(@CurrentUser() user: JwtPayloadType): Promise<User> {
		return this.authService.findMe(user);
	}

	@UseGuards(RefreshAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER, RoleEnum.ADMIN)
	@Query(() => SoftDeleteResult)
	async logout(
		@CurrentSession() session: JwtRefreshPayloadType,
	): Promise<SoftDeleteResult> {
		return this.authService.logout(session);
	}

	@Public()
	@Mutation(() => AuthRegisterResponseDto, { name: 'forgetPasswordEmail' })
	async forgotPassword(
		@Args('forgotPasswordDto') forgotPasswordDto: AuthForgotPasswordDto,
	): Promise<AuthRegisterResponseDto> {
			return await this.authService.forgotPassword(
				forgotPasswordDto.email,
			);
	}

	@Public()
	@Mutation(() => Boolean, { name: 'resetPassword' })
	async resetPassword(
		@Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
	): Promise<boolean> {
			return await this.authService.resetPassword(resetPasswordDto);
	}

	@Public()
	@Mutation(() => Boolean, { name: 'confirmOTP' })
	async confirmOTP(
		@Args('confirmEmailDto') confirmEmailDto: ConfirmEmailDto,
	): Promise<boolean> {
			return await this.authService.confirmOTP(confirmEmailDto);
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
  } */
}
