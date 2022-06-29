/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/api/user/models/entities/user.entity";
import { Repository } from "typeorm";
import { CreateProjectDto } from "../models/dto/create-project.dto";
import { Project } from "../models/entities/project.entity";

@Injectable()
export class ProjectService {

  constructor (
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) {}

  async createProject(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
    const { name, projectCode, startDate, endDate, price } = createProjectDto;
    const project = this.projectRepository.create({
      name,
      projectCode,
      startDate,
      endDate,
      price,
      manager: user,
    });

    await this.projectRepository.save(project);
    return project
  }

}
