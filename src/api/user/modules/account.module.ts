/* eslint-disable prettier/prettier */
import { MailerModule } from '@nestjs-modules/mailer';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/api/auth/services/auth.service';
import { AccountController } from '../controller/account.controller';
import { AccountEntity } from '../models/entities/account.entity';
import { User } from '../models/entities/user.entity';
import { AccountService } from '../services/account.service';
import { UserService } from '../services/user.service';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, User]),
    MailerModule.forRoot({
      transport: {
        host: '0.0.0.0',
        port: 1025,
      },
      defaults: {
        from: 'admin@example.com'
      }
    }),
    forwardRef(() => UserModule),
    JwtModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, UserService, AuthService, JwtService]
})
export class AccountModule {}
