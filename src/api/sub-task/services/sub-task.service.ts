/* eslint-disable prettier/prettier */

import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "src/api/project/models/entities/project.entity";
import { ProjectService } from "src/api/project/services/project.service";
import { Task } from "src/api/task/models/entities/task.entity";
import { User } from "src/api/user/models/entities/user.entity";
import { GetFilterDto } from "src/shared/get-filter.dto";
import { Repository } from "typeorm";
import { CreateSubTaskDto } from "../models/dto/create-sub-task.dto";
import { UpdateSubTaskDto } from "../models/dto/update-sub-task.dto";

@Injectable()
export class SubTaskService {
    constructor(
        @InjectRepository(Task)
        @InjectRepository(Project)
        private taskRepository: Repository<Task>,
        private projectService: ProjectService,
    ) {}
    
    async create(idProject: string, idTask: string, createSubTaskDto: CreateSubTaskDto, user: User): Promise<Task> {
      const findProject = await this.projectService.findProject(idProject);
      const assigneerId = await user.id
      const { title, description, reporter, priority, status, level, type, image } = createSubTaskDto;
      const task = this.taskRepository.create({
        title,
        description,
        reporter,
        priority,
        status,
        type,
        level,
        image,
        parentId: idTask,
        project: findProject,
        assigneer: assigneerId,
      });
  
      await this.taskRepository.save(task);
      return task
    }

    async getFilters(filterDto: GetFilterDto,idProject: string, idTask: string): Promise<Task[]> {
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
        return subTaskResults;
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }

    async update(idProject: string, idTask: string, idSubTask: string, updateSubTaskDto: UpdateSubTaskDto): Promise<Task> {
      const { title, description, reporter, priority, status, level, type, image } = updateSubTaskDto
      const findTask = await this.getById(idProject, idTask, idSubTask);
      if(findTask) {
        findTask.title = title;
        findTask.description = description;
        findTask.reporter = reporter;
        findTask.priority = priority;
        findTask.status = status;
        findTask.level = level;
        findTask.type = type;
        findTask.image = image;
      }
      await this.taskRepository.save(findTask)
      return findTask
    }

    async delete(idProject: string, idTask: string, idSubTask: string): Promise<void> {
      const findTask = await this.taskRepository.findOne(idSubTask)
      const findProject = await this.projectService.findProject(idProject)
      if(findTask) {
        const result = await this.taskRepository.delete({ id: idSubTask, project: findProject});
    
        if(result.affected === 0) {
          throw new NotFoundException(`Task with ID "${idSubTask}" not found`)
        }
      }
    }

    async getById(idProject: string, idTask: string, idSubTask: string): Promise<Task> {
      const findProject = await this.projectService.findProject(idProject)
      const findSubTask = await this.taskRepository.findOne({ where: { id: idSubTask, parentId: idTask, project: findProject }});
      if(!findSubTask) {
        throw new NotFoundException(`Task with ID ${idTask} not found`);
      }
      return findSubTask;
    }
}