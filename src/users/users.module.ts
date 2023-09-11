import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [JwtModule, PrismaModule, AuthModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
