import {
  BadRequestException,
  HttpException,
  HttpStatus, Inject,
  Injectable,
  NotFoundException, OnModuleInit, PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { RoleEnum } from '../roles/roles.enum';
import { Role } from '../roles/entities/role.entity';
import { StatusEnum } from '../statuses/statuses.enum';
import { Status } from '../statuses/entities/status.entity';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { LoginResponse } from './types/login-response.type';
import { AuthProvidersEnum } from './enums/auth-providers.enum';
import * as bcrypt from 'bcryptjs'
import { User } from '../users/entities/user.entity';
import { SessionService } from '../session/session.service';
import { Session } from '../session/entities/session.entity';
import ms from 'ms';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { SoftDeleteResult } from '../utils/types/delete-result.type';
import { OtpService } from '../otp/otp.service';
import otpGenerator from 'otp-generator';
import { CreateOTPDto } from '../otp/dto/create-otp.dto';
import { AuthRegisterResponseDto } from './dto/auth-register-response.dto';
import { runOnTransactionComplete, runOnTransactionRollback, Transactional } from 'typeorm-transactional';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { plainToClass } from 'class-transformer';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SharedServiceClient } from '../proto/shared';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private sharedService: SharedServiceClient;
  constructor(
    @Inject('USER_SERVICE') private client: ClientGrpc,
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private otpService: OtpService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  onModuleInit() {
    this.sharedService = this.client.getService<SharedServiceClient>('SharedService');
  }

  /**
   * User
   * @returns {Promise<AuthRegisterResponseDto>} success
   */
  @Transactional()
  async registerUser(authRegisterLoginDto: AuthRegisterLoginDto): Promise<AuthRegisterResponseDto> {
    runOnTransactionRollback(() =>
        console.log(`Registration Transaction rolled back`),
    );
    runOnTransactionComplete((error) => {
      if (!!error) {
        console.log(`Registration with transaction failed`);
        throw new HttpException(error, 500);
      }
      console.log(`Registration with transaction completed`);
    });
     const user = await this.usersService.create({
      ...authRegisterLoginDto,
      email: authRegisterLoginDto.email,
      role: {
        id: RoleEnum.USER,
      } as Role,
      status: {
        id: StatusEnum.INACTIVE,
      } as Status,
    });

    const data = this.getOtpObject(user.id)
    const otpRes = await this.otpService.create(data)
    const emailResult = await firstValueFrom(this.sharedService.confirmEmail({ otp: data.otp, expiryDate: data.expiryDate }));
    console.log('emailResult', emailResult);
    return new AuthRegisterResponseDto(otpRes.userId, otpRes.expiryDate)
  }

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponse> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
    });
    if (!user) {
      throw new NotFoundException(
        'User not found'
      );
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new BadRequestException(
        `need login via provider:${user.provider}`
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException(
        'Incorrect Password'
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
    });
    return {
      refreshToken,
      token,
      tokenExpires,
      user
    }
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto): Promise<boolean> {
    const user = await this.usersService.findOne({
      id: confirmEmailDto.userId,
    });
    if (user?.status?.id !== StatusEnum.INACTIVE) {
      throw new PreconditionFailedException('User already confirmed');
    }

    await this.confirmOTP(confirmEmailDto)

    user.status = plainToClass(Status, {
      id: StatusEnum.ACTIVE,
    });
    await user.save();
    return true
  }

  async resendOtp(resendOtpDto: ResendOtpDto): Promise<AuthRegisterResponseDto> {
    const data = this.getOtpObject(resendOtpDto.userId)
    const otp = await this.otpService.findOne({userId: resendOtpDto.userId})
    const otpRes = otp ? await this.otpService.update(otp.id, otp, data): await this.otpService.create(data)
    const emailResult = await firstValueFrom(this.sharedService.confirmEmail({ otp: data.otp, expiryDate: data.expiryDate }));
    console.log('emailResult', emailResult);
    return new AuthRegisterResponseDto(otpRes.userId, otpRes.expiryDate)
  }

  async refreshToken(
      data: JwtRefreshPayloadType,
  ): Promise<Omit<LoginResponse, 'user'>> {
    const session = await this.sessionService.findOne({
        id: data.sessionId,
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: session.user.role,
      sessionId: session.id,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async forgotPassword(email: string): Promise<AuthRegisterResponseDto> {
    const user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.resendOtp({ userId: user.id })
  }

  async confirmOTP (confirmEmailDto: ConfirmEmailDto) {
    const userOtp = await this.otpService.findOneOrFail({userId: confirmEmailDto.userId})
    const isValidOtp = await bcrypt.compare(
      confirmEmailDto.otp,
      userOtp.otp,
    );
    if (!isValidOtp) {
      throw new BadRequestException('OTP not correct')
    }
    if (userOtp.expiryDate < Date.now()) {
      throw new BadRequestException('OTP Expired')
    }
    return true
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const user = await this.usersService.findOne({ id: resetPasswordDto.userId });
    user.password = resetPasswordDto.password;

    await this.sessionService.softDelete({
      user: {
        id: user.id,
      },
    });
    await user.save();
    return true
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>):Promise<SoftDeleteResult> {
    return this.sessionService.softDelete({
      id: data.sessionId,
    });
  }

  async findMe(user: JwtPayloadType) {
    return this.usersService.findOne({id: user.id})
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          role: data.role,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);
    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
 private getOtpObject (userId: number): CreateOTPDto {
  const otpExpiresIn = this.configService.getOrThrow('auth.confirmEmailExpires', {
    infer: true,
  })
  const otpExpires = Date.now() + ms(otpExpiresIn);
  const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
  return new CreateOTPDto(otp, userId, otpExpires)
}
}
