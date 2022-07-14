/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from '../services/account.service';
import { SendEmailResetDto } from '../models/dto/send-email-reset.dt';
import { SendEmailForgotDto } from '../models/dto/send-email-forgot.dto';
import { SendEmailChangetDto } from '../models/dto/send-email-change.dto';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { UserI } from '../models/entities/user.interface';
import { LoginUserDto } from '../models/dto/login-user.dto';
import { GetTokenDto } from '../models/dto/get-token.dto';


@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(
        private accountService: AccountService,
    ) {}

    @Post('register')
    @ApiResponse({
        status: 201,
        description: 'Registered user',
        type: CreateUserDto,
    })
    @ApiOperation({ summary: 'Register account' })
    async register(@Body() createUserDto: CreateUserDto): Promise<UserI> {
        return this.accountService.register(createUserDto)
    }

    @Post('/confirm-account')
    @ApiResponse({
        status: 201,
        description: 'Confirm Account',
    })
    @ApiOperation({ summary: 'Confirm account' })
    async confirmAccount(@Body() token: GetTokenDto ): Promise<any> {
        return this.accountService.confirmAccount(token)
    }

    @Post('login')
    @ApiResponse({
        status: 200,
        description: 'Login account',
        type: LoginUserDto,
    })
    @ApiOperation({ summary: 'Login account' })
    async login(
        @Body() loginUserDto: LoginUserDto
    ): Promise<any> {
        return this.accountService.login(loginUserDto);
    }

    @Post('forgot-password')
    @ApiResponse({
        status: 200,
        description: 'Forgot password',
        type: LoginUserDto,
    })
    @ApiOperation({ summary: 'Forgot password' })
    async forgotPassword(@Body() sendEmailForgotDto: SendEmailForgotDto) {
        return this.accountService.forgotPassword(sendEmailForgotDto)
    }

    @Post('reset-password')
    @ApiResponse({
        status: 200,
        description: 'Reset password',
        type: LoginUserDto,
    })
    @ApiOperation({ summary: 'Reset password' })
    async resetPassword(
        @Body() sendEmailResetDto: SendEmailResetDto 
    ) {
        return this.accountService.resetPassword(sendEmailResetDto)
    }
    @Post('/confirm-change-password')
    @ApiResponse({
        status: 200,
        description: 'Confirm change password',
        type: LoginUserDto,
    })
    @ApiOperation({ summary: 'Confirm change password' })
    async confirmChangePassword(
        @Body() sendEmailForgotDto: SendEmailForgotDto 
    ) {
        return this.accountService.confirmChangePassword(sendEmailForgotDto)
    }

    @Post('/change-password')
    @ApiResponse({
        status: 200,
        description: 'Change password',
        type: LoginUserDto,
    })
    @ApiOperation({ summary: 'Change password' })
    async changePassword(
        @Body() sendEmailChangetDto: SendEmailChangetDto 
    ) {
        return this.accountService.changePassword(sendEmailChangetDto)
    }
}
