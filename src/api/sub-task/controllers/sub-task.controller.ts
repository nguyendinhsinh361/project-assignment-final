/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { extname } from "path";
import { JwtAuthGuard } from "src/api/auth/guards/jwt-auth.guard";
import { User } from "src/api/user/models/entities/user.entity";
import { GetUser } from "src/shared/config.decorator";
import { GetFilterDto } from "src/shared/get-filter.dto";
import { GetIdDto } from "src/shared/get-id.dto";
import { CreateSubTaskDto } from "../models/dto/create-sub-task.dto";
import { UpdateSubTaskDto } from "../models/dto/update-sub-task.dto";
import { SubTaskService } from "../services/sub-task.service";
import { diskStorage } from 'multer';

@ApiTags('Sub-Tasks')
@Controller('projects/tasks/sub')
export class SubTaskController {
    constructor(
        private subTaskService: SubTaskService
    ) {}

    @Post('/create')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
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
        description: 'Create sub-task',
    })
    @ApiOperation({ summary: 'Create sub-task' })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Query() query: GetIdDto,
        @Body() createSubTaskDto: CreateSubTaskDto,
        @GetUser() user: User,
    ): Promise<any> {
        return this.subTaskService.create(query.id_project, query.id_task, createSubTaskDto, user, file)
    }

    @Get('/get-many')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Get many sub-tasks by filters',
    })
    @ApiOperation({ summary: 'Get many sub-tasks by filters' })
    async getFilters(
        @Query()  filterDto: GetFilterDto,
        @Query() query: GetIdDto,
    ): Promise<any> {
        return this.subTaskService.getFilters(filterDto, query.id_project, query.id_task)
    }

    @Patch('/update/:id_sub_task')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
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
        description: 'Update sub-task',
    })
    @ApiOperation({ summary: 'Update sub-task' })
    async update(
        @UploadedFile() file: Express.Multer.File,
        @Query() query: GetIdDto,
        @Param('id_sub_task') idSubTask: string, 
        @Body() updateSubTaskDto: UpdateSubTaskDto,
    ): Promise<any> {
        return this.subTaskService.update(query.id_project, query.id_task, idSubTask, updateSubTaskDto, file)
    }

    @Delete('/delete/:id_sub_task')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Delete sub-task',
    })
    @ApiOperation({ summary: 'Delete sub-task' })
    async delete(
        @Query() query: GetIdDto,
        @Param('id_sub_task') idSubTask: string, 
    ): Promise<any> {
        return this.subTaskService.delete(query.id_project, query.id_task, idSubTask)
    }

    @Get('/get-detail/:id_sub_task')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Create task',
    })
    @ApiOperation({ summary: 'Create task' })
    async getById(
        @Query() query: GetIdDto,
        @Param('id_sub_task') idSubTask: string, 
    ): Promise<any> {
        return this.subTaskService.getById(query.id_project, query.id_task, idSubTask)
    }
}