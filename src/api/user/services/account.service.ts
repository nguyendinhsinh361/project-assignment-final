/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { SendEmailForgotDto } from '../models/dto/send-email-forgot.dto';
import { SendEmailResetDto } from '../models/dto/send-email-reset.dt';
import { AccountEntity } from '../models/entities/account.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { SendEmailChangetDto } from '../models/dto/send-email-change.dto';
import { DataReponse } from 'src/shared/data-reponse';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { LoginUserDto } from '../models/dto/login-user.dto';
import { AuthService } from 'src/api/auth/services/auth.service';
import { GetTokenDto } from '../models/dto/get-token.dto';
import { User } from '../models/entities/user.entity';


@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountEntity)
        private accountRepository: Repository<AccountEntity>,
        private mailerService: MailerService,
        private userService: UserService,
        private authService: AuthService,
    ) {}

    async createSPA(): Promise<void> {
        const userRepository = getRepository(User);
        const superadmin = { 
          name: process.env.SPA_NAME,
          email: process.env.SPA_EMAIL,
          password: await bcrypt.hash(process.env.SPA_PASSWORD, 12),
          role: process.env.SPA_ROLE,
          isActive: true,
        };
        await userRepository.save(superadmin);
      }

    async register(createUserDto: CreateUserDto): Promise<any> {
        const findSPA = await this.userService.findOne({name: 'superadmin'});
        if(!findSPA) {
            await this.createSPA();
        }
        const { name, email, password } = createUserDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.userService.create({
            name,
            email,
            password: hashedPassword
        });
    
        try {
          const token = Math.random().toString(20).substring(2, 12);
            if(await this.userService.save(user)) {
              await this.accountRepository.save({email, token});
              await this.mailerService.sendMail({
                to: email, 
                subject: 'Confirm Account', 
                html: `${token}`,
              });
            }
        } catch (error) {
            if(error.code === '23505') {
                throw new ConflictException('Email or name already exists')
            }else {
                throw new InternalServerErrorException();
            }
        }
        const resultUser = await this.userService.findOne({email})
        delete resultUser.password
        return {
          message: 'Please check your email to confirm',
          resultUser
        }
    }

    async confirmAccount(token: GetTokenDto) {
        const findUser = await this.findOne(token);
        const user = await this.userService.findOne({email: findUser.email})
        user.isActive = true;
        await this.userService.save(user)
        if(user) {
          return DataReponse(`Confirm account successfully`, {'Acitived': true})
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const { email, password } = loginUserDto
        const user = await this.userService.findOne({email});
        if(user.isActive == true && (await this.validatePassword(password, user.password))) {
            const jwt = await this.jwt(email);
            return DataReponse(`Login successfully`, {'Access-token': jwt})
        }else {
            throw new UnauthorizedException('Please check your login credentials or confirm email')
        } 
    }

    async forgotPassword(sendEmailForgotDto: SendEmailForgotDto) {
        const { email } = sendEmailForgotDto;
        const token = Math.random().toString(20).substring(2, 12);
        const checkEmail = await this.accountRepository.findOne({email});
        await this.accountRepository.update(checkEmail.id, {token: token});
        await this.mailerService.sendMail({
            to: email, 
            subject: 'Reset your password', 
            html: `${token}`,
        });

        return {
            message: 'Please check your email'
        }
        
    }

    async resetPassword(sendEmailResetDto: SendEmailResetDto) {
        const {token, password, password_confirm} = sendEmailResetDto
        if(password_confirm !== password) {
            throw new BadRequestException(`Password do not match`)
        }

        const findUser: any = await this.findOne({token});
        const user = await this.findOne({email: findUser.email})

        if(!user) {
            throw new NotFoundException('User not found !')
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await this.userService.update(user.id, {password: hashedPassword})

        return {
            message: 'Reset password successfully !',
        }
    }

    async confirmChangePassword(sendEmailForgotDto: SendEmailForgotDto) {
        const { email } = sendEmailForgotDto;
        const token = Math.random().toString(20).substring(2, 12);
        const checkEmail = await this.accountRepository.findOne({email});
        await this.accountRepository.update(checkEmail.id, {token: token});
        await this.mailerService.sendMail({
            to: email, 
            subject: 'Change your password', 
            html: `${token}`,
        });

        return {
            message: 'Please check your email'
        }
        
    }

    async changePassword(sendEmailChangetDto: SendEmailChangetDto ) {
        const {token, oldPassword, newPassword, confirm_newPassword} = sendEmailChangetDto;
    
        if(newPassword !== confirm_newPassword) {
            throw new BadRequestException(`Password do not match`)
        }

        const userUpdate: any = await this.findOne({token});
        const user = await this.userService.findOne({email: userUpdate.email})
        if(await bcrypt.compare(oldPassword, user.password)) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(newPassword, salt);
    
            await this.userService.update(user.id, {password: hashedPassword})
        }

        if(!user) {
            throw new NotFoundException('User not found !')
        }

        return {
            message: 'Reset password successfully !',
        }
    }

    async updateReset(id: number, data: any) {
        return this.accountRepository.update(id, data)
    }

    async findOne(data: any) {
        return this.accountRepository.findOne(data);
    }

    async save(data: any) {
        return this.accountRepository.save(data);
    }

    async jwt(email: string): Promise<string> {
        return this.authService.generateJwt(email);
    }

    async validatePassword(password: string, storedPasswordHash: string): Promise<boolean> {
        return this.authService.comparePasswords(password, storedPasswordHash);
    }
}
