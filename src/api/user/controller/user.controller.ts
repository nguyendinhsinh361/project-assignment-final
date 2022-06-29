/* eslint-disable prettier/prettier */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { UserI } from '../models/entities/user.interface';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(
    private userService: UserService,
    ) { }
    

    
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: 'User info',
    })
    async findAll(@Req() request): Promise<UserI[]> {
        return this.userService.findAll();
    }
}