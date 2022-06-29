/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/api/auth/auth.module';
import { UserService } from '../services/user.service';
import { UserController } from '../controller/user.controller';
import { User } from '../models/entities/user.entity';
import { AccountEntity } from '../models/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AccountEntity]),
    AuthModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}