/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard';
import { GetUser, Roles } from 'src/shared/config.decorator';
import { RoleAdminOrSuperAdmin } from 'src/shared/role-admin-or-spa.guard';
import { UpdateProfile } from '../models/dto/update-profile.dto';
import { UserRoleEnum } from '../models/entities/user-role.enum';
import { User } from '../models/entities/user.entity';
import { UserI } from '../models/entities/user.interface';
import { UserService } from '../services/user.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(
    private userService: UserService,
    ) { }
    

    
    @Get('/get-many')
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: 'Get many user information by filters',
    })
    @ApiOperation({ summary: 'Get many user information by filters' })
    async findAll(@Req() request): Promise<UserI[]> {
        return this.userService.findAll();
    }

    @Delete('/delete/:id')
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

    @Patch('/update/:id')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: './upload/avatar-img',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: 'Give permission to admin',
    })
    @ApiOperation({ summary: 'Give permission to admin' })
    async update(
        @Param('id') id:string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateProfile: UpdateProfile,
    ): Promise<UserI> {
        return this.userService.updateProfile(id, file, updateProfile);
    }

    @Patch('/authority/:id')
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

    @Get('/get-detail/:id')
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

    @Get('/get-current-user')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 201,
        description: 'Detail info user is logged in',
    })
    @ApiOperation({ summary: 'Detail info user is logged in' })
    async watchInfo(@GetUser() user: User) : Promise<User> {
        return this.userService.watchInfo(user);
    }
}