import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogle } from './entities/auth-google.entity';
import { AuthGoogleLoginDto } from './dto/create-auth-google.dto';
import { AuthService } from '../auth/auth.service';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { LoginResponse } from '../auth/types/login-response.type';

@Resolver(() => AuthGoogle)
export class AuthGoogleResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @Mutation(() => AuthGoogle, { name: 'googleLogin' })
  async createAuthGoogle(@Args('authGoogleLoginDto') authGoogleLoginDto: AuthGoogleLoginDto): Promise<LoginResponse> {
    try {
      const socialData = await this.authGoogleService.getProfileByToken(authGoogleLoginDto);
      return this.authService.validateSocialLogin('google', socialData);
    } catch (error) {
      throw new HttpResponseException(error);
    }

  }
}
