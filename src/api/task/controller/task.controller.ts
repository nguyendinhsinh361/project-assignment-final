/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/api/auth/guards/jwt-auth.guard";
import { UserRoleEnum } from "src/api/user/models/entities/user-role.enum";
import { User } from "src/api/user/models/entities/user.entity";
import { GetUser, Roles } from "src/shared/config.decorator";
import { GetFilterDto } from "src/shared/get-filter.dto";
import { RoleAdminOrSuperAdmin } from "src/shared/roles.guard";
import { CreateTaskDto } from "../models/dto/create-task.dto";
import { UpdateTaskDto } from "../models/dto/update-task.dto";
import { TaskService } from "../services/task.service";

@ApiTags('Tasks')
@Controller('projects/:id_project/tasks')
export class TaskController {
    constructor(
        private taskService: TaskService
    ) {}

    @Post()
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Create task',
    })
    @ApiOperation({ summary: 'Create task' })
    async create(
        @Param('id_project') idProject: string, 
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<any> {
        return this.taskService.create(idProject, createTaskDto, user)
    }

    @Get()
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
        @Param('id_project') idProject: string, 
    ): Promise<any> {
        return this.taskService.getFilters(filterDto, idProject)
    }

    @Patch('/:id_task')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Update task',
    })
    @ApiOperation({ summary: 'Update task' })
    async update(
        @Param('id_project') idProject: string, 
        @Param('id_task') idTask: string, 
        @Body() updateTaskDto: UpdateTaskDto,
    ): Promise<any> {
        return this.taskService.update(idProject, idTask, updateTaskDto)
    }

    @Delete('/:id_task')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Delete task',
    })
    @ApiOperation({ summary: 'Delete task' })
    async delete(
        @Param('id_project') idProject: string, 
        @Param('id_task') idTask: string, 
    ): Promise<any> {
        return this.taskService.delete(idProject, idTask)
    }

    @Get('/:id_task')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Create task',
    })
    @ApiOperation({ summary: 'Create task' })
    async getById(
        @Param('id_project') idProject: string, 
        @Param('id_task') idTask: string,
    ): Promise<any> {
        return this.taskService.getById(idProject, idTask)
    }

}
