import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthType } from './entities/auth.entity';
import { SignUpInput } from './dto/signup-input';
// import { UpdateAuthInput } from './dto/update-pws-input';
import { SignResponse } from './dto/sign-in-response';
import { SignInInput } from './dto/signin-input';
import { LogOutResponse } from './dto/logout-resposne';
import { Public } from './decorators/public.decorator';
import { NewTokensResponse } from './dto/new-token-response';
import { CurrentUserId } from './decorators/currentUserId.decorator';
import { CurrentUser } from './decorators/currentUser.decorator';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { UUID } from 'crypto';

@Resolver(() => AuthType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignResponse)
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Public()
  @Mutation(() => SignResponse)
  signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Public()
  @Mutation(() => LogOutResponse)
  logOut(@Args('id', { type: () => Int }) id: string) {
    return this.authService.logOut(id);
  }

  @Query(() => String)
  hello() {
    return 'Hello';
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokensResponse)
  getNewTokens(
    @CurrentUserId() userId: UUID,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.getNewTokens(userId, refreshToken);
  }
}
