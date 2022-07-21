/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "src/api/project/models/entities/project.entity";
import { ProjectService } from "src/api/project/services/project.service";
import { TaskTypeEnum } from "src/api/task/models/entities/task-type.enum";
import { Task } from "src/api/task/models/entities/task.entity";
import { User } from "src/api/user/models/entities/user.entity";
import { GetFilterDto } from "src/shared/get-filter.dto";
import { Repository } from "typeorm";
import { CreateSubTaskDto } from "../models/dto/create-sub-task.dto";
import { UpdateSubTaskDto } from "../models/dto/update-sub-task.dto";
import * as fs from 'fs';
import { DataReponse } from "src/shared/data-reponse";
import { MessageFailedI, MessageSuccessfullyI } from "src/shared/message.interfacae";

@Injectable()
export class SubTaskService {
    constructor(
        @InjectRepository(Task)
        @InjectRepository(Project)
        private taskRepository: Repository<Task>,
        private projectService: ProjectService,
    ) {}
    
    async create(idProject: string, idTask: string, createSubTaskDto: CreateSubTaskDto, user: User, file: Express.Multer.File): Promise<any> {
      const findProject = await this.projectService.findProject(idProject);
      const findTask = await this.taskRepository.findOne({id: idTask});
      const assigneerId = user.id
      const { title, description, reporter, priority, status, level } = createSubTaskDto;
      if(findProject && findTask.assigneer == Number(assigneerId)) {
        const sub_task = await this.taskRepository.create({
          title,
          description,
          reporter,
          priority,
          status,
          type: TaskTypeEnum.SUB_TASK,
          level,
          parentId: idTask,
          project: findProject,
          assigneer: findTask.assigneer
        });
        if (file) {
          if (fs.existsSync(sub_task.image)) {
              fs.unlinkSync(`./${sub_task.image}`);
          }
          sub_task.image = file.path;
        }
    
        await this.taskRepository.save(sub_task);
        return DataReponse(MessageSuccessfullyI.CREATE, sub_task)
      }else {
        return DataReponse(MessageFailedI.NOT_FOUND, {})
      }
    }

    async getFilters(filterDto: GetFilterDto,idProject: string, idTask: string): Promise<any> {
      const { search } = filterDto;
      const query = this.taskRepository.createQueryBuilder('task');
      query.where("task.projectId = :id", {id: idProject})

      if (search) {
        query.andWhere(
          '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.priority) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }
      try {
        const tasks = await query.getMany();
        const subTaskResults = tasks.filter(sub => sub.parentId == idTask);
        return DataReponse(MessageSuccessfullyI.GET_MANY_TASKS, subTaskResults);
      } catch (error) {
        throw new NotFoundException(MessageFailedI.NOT_FOUND)
      }
    }

    async update(idProject: string, idTask: string, idSubTask: string, updateSubTaskDto: UpdateSubTaskDto, file: Express.Multer.File): Promise<any> {
      const { title, description, reporter, priority, status, level, type, image } = updateSubTaskDto
      const findProject = await this.projectService.findProject(idProject)
      const findSubTask = await this.taskRepository.findOne({ where: { id: idSubTask, parentId: idTask, project: findProject }});
      if(findSubTask) {
        findSubTask.title = title;
        findSubTask.description = description;
        findSubTask.reporter = reporter;
        findSubTask.priority = priority;
        findSubTask.status = status;
        findSubTask.level = level;
        findSubTask.type = type;
        if (file) {
          if (fs.existsSync(findSubTask.image)) {
              fs.unlinkSync(`./${findSubTask.image}`);
          }
          findSubTask.image = file.path;
        }
      }

      
      await this.taskRepository.save(findSubTask)
      return DataReponse(MessageSuccessfullyI.UPDATE, findSubTask);
    }

    async delete(idProject: string, idTask: string, idSubTask: string): Promise<any> {
      const findTask = await this.taskRepository.findOne(idSubTask)
      const findProject = await this.projectService.findProject(idProject)
      if(findTask) {
        const result = await this.taskRepository.delete({ id: idSubTask, project: findProject});
        if(result.affected === 0) {
          throw new NotFoundException(MessageFailedI.NOT_FOUND)
        }else {
          return DataReponse(MessageSuccessfullyI.DELETE, {});
        }
      }
    }

    async getById(idProject: string, idTask: string, idSubTask: string): Promise<any> {
      const findProject = await this.projectService.findProject(idProject)
      const findSubTask = await this.taskRepository.findOne({ where: { id: idSubTask, parentId: idTask, project: findProject }});
      if(!findSubTask) {
        throw new NotFoundException(MessageFailedI.NOT_FOUND)
      }else {
        return DataReponse(MessageSuccessfullyI.GET_DETAIL, findSubTask)
      }
    }
}