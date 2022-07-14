/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { GetUser, Roles } from 'src/shared/config.decorator';
import { RoleAdminOrSuperAdmin } from 'src/shared/roles.guard';
import { UserRoleEnum } from '../models/entities/user-role.enum';
import { User } from '../models/entities/user.entity';
import { UserI } from '../models/entities/user.interface';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(
    private userService: UserService,
    ) { }
    

    
    @Get('/all-user')
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: 'All user information',
    })
    @ApiOperation({ summary: 'Get all user information' })
    async findAll(@Req() request): Promise<UserI[]> {
        return this.userService.findAll();
    }

    @Delete('/:id')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Delete user',
    })
    @ApiOperation({ summary: 'Delete user' })
    delete(
        @Param('id') id: string,
        @GetUser() user: User,
        ): Promise<any> {
        return this.userService.delete(id, user);
    }

    @Patch('/:id')
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: 'User Info',
    })
    @ApiOperation({ summary: 'Give permission to admin' })
    async authorizeAdmin(@Param('id') id:string): Promise<UserI> {
        return this.userService.authorizeAdmin(id);
    }

    @Get('/:id')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 201,
        description: 'Find user by id',
    })
    @ApiOperation({ summary: 'Find user by id' })
    async findById(@Param('id') id: string) : Promise<UserI> {
        return this.userService.findById(id);
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 201,
        description: 'Detail info',
    })
    @ApiOperation({ summary: 'Watch detail info user' })
    async watchInfo(@GetUser() user: User) : Promise<User> {
        return this.userService.watchInfo(user);
    }

}