import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/signup-input';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignInInput } from './dto/signin-input';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signUp(signUpInput: SignUpInput) {
    const extUser = await this.prisma.users.findUnique({
      where: { email: signUpInput.email },
    });
    if (extUser) {
      throw new ForbiddenException('An Email has already exist!');
    }
    const hashPassword = await argon.hash(signUpInput.password);
    const user = await this.prisma.users.create({
      data: {
        email: signUpInput.email,
        hashed_password: hashPassword,
        full_name: 'abababa',
        phone: '123456789',
        hashed_token: 'null',
      },
    });
    const { accessToken, refreshToken } = await this.createTokens(
      parseInt(user.id),
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async signIn(signInInput: SignInInput) {
    const user = await this.prisma.users.findUnique({
      where: { email: signInInput.email },
    });
    if (!user) {
      throw new ForbiddenException('Email is not exist!');
    }
    const checkPassword = await argon.verify(
      user.hashed_password,
      signInInput.password,
    );
    if (!checkPassword) {
      throw new ForbiddenException('Password is not correct!');
    }
    const { accessToken, refreshToken } = await this.createTokens(
      parseInt(user.id),
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  findOne(id: string) {
    return `This action returns a #${id} auth`;
  }

  // update(id: string, updateAuthInput: UpdateAuthInput) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: string) {
    return `This action removes a #${id} auth`;
  }

  async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '1h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.users.update({
      where: { id: userId.toString() },
      data: { hashed_token: hashedRefreshToken },
    });
  }
  async logOut(userId: string) {
    await this.prisma.users.updateMany({
      where: {
        id: userId.toString(),
      },
      data: { hashed_token: null },
    });
    return { loggedOut: true };
  }

  async getNewTokens(userId: string, rt: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId.toString() },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied!');
    }
    const doRefreshTokenMatch = await argon.verify(user.hashed_token, rt);
    if (!doRefreshTokenMatch) {
      throw new ForbiddenException('Access Denied!');
    }
    const { accessToken, refreshToken } = await this.createTokens(
      parseInt(user.id),
      user.email,
    );
    return { accessToken, refreshToken, user };
  }
}
