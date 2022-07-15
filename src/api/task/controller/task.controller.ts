/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { extname } from "path";
import { JwtAuthGuard } from "src/api/auth/guards/jwt-auth.guard";
import { UserRoleEnum } from "src/api/user/models/entities/user-role.enum";
import { User } from "src/api/user/models/entities/user.entity";
import { GetUser, Roles } from "src/shared/config.decorator";
import { GetFilterDto } from "src/shared/get-filter.dto";
import { GetIdDto } from "src/shared/get-id.dto";
import { RoleAdminOrSuperAdmin } from "src/shared/role-admin-or-spa.guard";
import { CreateTaskDto } from "../models/dto/create-task.dto";
import { UpdateTaskDto } from "../models/dto/update-task.dto";
import { TaskService } from "../services/task.service";
import { diskStorage } from 'multer';

@ApiTags('Tasks')
@Controller('projects/tasks')
export class TaskController {
    constructor(
        private taskService: TaskService
    ) {}

    @Post('/create')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './upload/task-img',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    @ApiResponse({
        status: 200,
        description: 'Create task',
    })
    @ApiOperation({ summary: 'Create task' })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Query() query: GetIdDto,
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<any> {
        return this.taskService.create(query.id_project, createTaskDto, user, file)
    }

    @Get('/get-many')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Get many tasks by filters',
    })
    @ApiOperation({ summary: 'Get many tasks by filters' })
    async getFilters(
        @Query() filterDto: GetFilterDto,
        @Query() query: GetIdDto,
    ): Promise<any> {
        return this.taskService.getFilters(filterDto, query.id_project)
    }

    @Patch('/update')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './upload/task-img',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    @ApiResponse({
        status: 200,
        description: 'Update task',
    })
    
    @ApiOperation({ summary: 'Update task' })
    async update(
        @UploadedFile() file: Express.Multer.File,
        @Query() query: GetIdDto,
        @Body() updateTaskDto: UpdateTaskDto,
    ): Promise<any> {
        return this.taskService.update(query.id_project, query.id_task, updateTaskDto, file)
    }

    @Delete('/delete')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Delete task',
    })
    @ApiOperation({ summary: 'Delete task' })
    async delete(
        @Query() query: GetIdDto,
    ): Promise<any> {
        return this.taskService.delete(query.id_project, query.id_task)
    }

    @Get('/get-detail')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Get task by id',
    })
    @ApiOperation({ summary: 'Get task by id' })
    async getById(
        @Query() query: GetIdDto,
    ): Promise<any> {
        return this.taskService.getById(query.id_project, query.id_task)
    }

}
