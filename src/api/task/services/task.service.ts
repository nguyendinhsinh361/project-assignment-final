/* eslint-disable prettier/prettier */

import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "src/api/project/models/entities/project.entity";
import { ProjectService } from "src/api/project/services/project.service";
import { AccountEntity } from "src/api/user/models/entities/account.entity";
import { User } from "src/api/user/models/entities/user.entity";
import { AccountService } from "src/api/user/services/account.service";
import { DataReponse } from "src/shared/data-reponse";
import { GetFilterDto } from "src/shared/get-filter.dto";
import { Repository } from "typeorm";
import { CreateTaskDto } from "../models/dto/create-task.dto";
import { UpdateTaskDto } from "../models/dto/update-task.dto";
import { Task } from "../models/entities/task.entity";

@Injectable()
export class TaskService {
    constructor(
        private mailerService: MailerService,
        @InjectRepository(Task)
        @InjectRepository(Project)
        @InjectRepository(AccountEntity)
        private taskRepository: Repository<Task>,
        private projectService: ProjectService,
        private accountService: AccountService,
        
    ) {}
    
    async create(idProject: string, createTaskDto: CreateTaskDto, user: User): Promise<any | Task> {
      const findProject = await this.projectService.findProject(idProject);
      const assigneerId = await user.id
      const { title, description, reporter, priority, status, level, type, image } = createTaskDto;
      const task = this.taskRepository.create({
        title,
        description,
        reporter,
        priority,
        status,
        type,
        level,
        image,
        project: findProject,
        assigneer: assigneerId,
      });

      if(type == 'bug') {
        const token = Math.random().toString(20).substring(2, 12);
        const checkEmail = await this.accountService.findOne({email: user.email});
        if(!checkEmail) {
            await this.accountService.save({email: user.email, token});
        }else {
            await this.accountService.update(checkEmail.id, {token: token});
        }
        await this.mailerService.sendMail({
            to: user.email, 
            subject: 'There is a bug that needs you to fix soon', 
            html: `${token}`,
        });

        await this.taskRepository.save(task);
        return DataReponse('Please check your email', task)
      }
    }

    async getFilters(filterDto: GetFilterDto, idProject: string): Promise<Task[]> {
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
        return tasks;
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }

    async update(idProject: string, idTask: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
      const { title, description, reporter, priority, status, level, type, image } = updateTaskDto
      const findTask = await this.getById(idProject, idTask);
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

    async delete(idProject: string, idTask: string): Promise<void> {
      const findTask = await this.taskRepository.findOne(idTask)
      const findProject = await this.projectService.findProject(idProject)
      if(findTask) {
        const result = await this.taskRepository.delete({ id: idTask, project: findProject});
    
        if(result.affected === 0) {
          throw new NotFoundException(`Task with ID "${idTask}" not found`)
        }
      }
    }

    async getById(idProject: string, idTask: string): Promise<Task> {
      const findProject = await this.projectService.findProject(idProject)
      const findTask = await this.taskRepository.findOne({ where: { id: idTask, project: findProject }});
  
      if(!findTask) {
        throw new NotFoundException(`Task with ID ${idTask} not found`);
      }
      return findTask;
    }
}
