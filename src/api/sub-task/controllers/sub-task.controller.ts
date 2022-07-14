/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/api/auth/guards/jwt-auth.guard";
import { UserRoleEnum } from "src/api/user/models/entities/user-role.enum";
import { User } from "src/api/user/models/entities/user.entity";
import { GetUser, Roles } from "src/shared/config.decorator";
import { GetFilterDto } from "src/shared/get-filter.dto";
import { RoleAdminOrSuperAdmin } from "src/shared/roles.guard";
import { CreateSubTaskDto } from "../models/dto/create-sub-task.dto";
import { UpdateSubTaskDto } from "../models/dto/update-sub-task.dto";
import { SubTaskService } from "../services/sub-task.service";

@ApiTags('Sub-Tasks')
@Controller('projects/:id_project/tasks/:id_task/sub')
export class SubTaskController {
    constructor(
        private subTaskService: SubTaskService
    ) {}

    @Post()
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Create sub-task',
    })
    @ApiOperation({ summary: 'Create sub-task' })
    async create(
        @Param('id_project') idProject: string, 
        @Param('id_task') idTask: string, 
        @Body() createSubTaskDto: CreateSubTaskDto,
        @GetUser() user: User,
    ): Promise<any> {
        return this.subTaskService.create(idProject, idTask, createSubTaskDto, user)
    }

    @Get()
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Get many sub-tasks by filters',
    })
    @ApiOperation({ summary: 'Get many sub-tasks by filters' })
    async getFilters(
        @Query()  filterDto: GetFilterDto,
        @Param('id_project') idProject: string, 
        @Param('id_task') idTask: string, 
    ): Promise<any> {
        return this.subTaskService.getFilters(filterDto, idProject, idTask)
    }

    @Patch('/:id_sub_task')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Update sub-task',
    })
    @ApiOperation({ summary: 'Update sub-task' })
    async update(
        @Param('id_project') idProject: string, 
        @Param('id_task') idTask: string, 
        @Param('id_sub_task') idSubTask: string, 
        @Body() updateSubTaskDto: UpdateSubTaskDto,
    ): Promise<any> {
        return this.subTaskService.update(idProject, idTask, idSubTask, updateSubTaskDto)
    }

    @Delete('/:id_sub_task')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Delete sub-task',
    })
    @ApiOperation({ summary: 'Delete sub-task' })
    async delete(
        @Param('id_project') idProject: string, 
        @Param('id_task') idTask: string, 
        @Param('id_sub_task') idSubTask: string, 
    ): Promise<any> {
        return this.subTaskService.delete(idProject, idTask, idSubTask)
    }

    @Get('/:id_sub_task')
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
        @Param('id_sub_task') idSubTask: string, 
    ): Promise<any> {
        return this.subTaskService.getById(idProject, idTask, idSubTask)
    }
}