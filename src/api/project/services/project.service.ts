/* eslint-disable prettier/prettier */

import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/api/user/models/entities/user.entity";
import { UserService } from "src/api/user/services/user.service";
import { DataReponse } from "src/shared/data-reponse";
import { GetFilterDto } from "src/shared/get-filter.dto";
import { Repository } from "typeorm";
import { AddMemberDto } from "../models/dto/add-member.dto";
import { CreateProjectDto } from "../models/dto/create-project.dto";
import { DeleteMember } from "../models/dto/delete-member.dto";
import { UpdateProjectDto } from "../models/dto/update-project.dto";
import { Project } from "../models/entities/project.entity";
import { Projects_Members } from "../models/entities/projects_members.entity";

@Injectable()
export class ProjectService {

  constructor (
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Projects_Members)
    private projects_membersRepository: Repository<Projects_Members>,
    private userService: UserService
  ) {}


  async getFilters(filter: GetFilterDto, user: User) : Promise<any> {
    if(user.role == 'user') {
      const result = await this.projects_membersRepository.find({ where: { userId: user.id}})
        const promiseDetailProjectResult = result.map(async (res) => {
        const foundProject = await this.projects_membersRepository.findOne({where: { id: res.id }})
        const foundProjectDetail = await this.projectRepository.findOne({ where: { id: foundProject.projectId}});
        return foundProjectDetail;
      })
      const detailProjectsResult = await Promise.all(promiseDetailProjectResult);
      return DataReponse(`All projects of the user have the id ${user.id}:`, detailProjectsResult)

    }else {
      const queryP = this.projectRepository.createQueryBuilder('project');
      const { search } = filter;
      queryP.where("project.managerId = :id", {id: user.id})
      if (search) {
        queryP.andWhere(
          '(LOWER(project.name) LIKE LOWER(:search) OR LOWER(project.price) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }
      try {
        const projects = await queryP.getMany();
        return DataReponse(`All projects of the user have the id ${user.id}:`, projects)
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }

  async createProject(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
    const { name, projectCode, startDate, endDate, price, maximum_members } = createProjectDto;
    const project = await this.projectRepository.create({
      name,
      projectCode,
      startDate,
      endDate,
      price,
      maximum_members,
      manager: user,
    });

    await this.projectRepository.save(project);
    return project
  }

  async delete(id: string, user: User): Promise<any> {
    const result = await this.projectRepository.delete({ id, manager: user});
    
    if(result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }else {
      return DataReponse('Delete project successfully', {})
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: User): Promise<any> {
    const { name, projectCode, status, startDate, endDate, price, maximum_members, managerId } = updateProjectDto
    const project = await this.getById(id);

    project.name = name;
    project.projectCode = projectCode;
    project.status = status;
    project.startDate = startDate;
    project.endDate = endDate;
    project.price = price;
    project.maximum_members = maximum_members;
    
    if(managerId) {
      const findManager = await this.userService.findOne({id: managerId});
      delete findManager.password;
      project.manager = findManager;
    }
    await this.projectRepository.save(project)
    return DataReponse('Delete project successfully', project)
  }

  async getById(id: string): Promise<Project> {
    const found = await this.projectRepository.findOne({ where: { id }});

    if(!found) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return found;
  }

  async findProject(id: string) : Promise<Project> {
    return this.projectRepository.findOne(id)
  }

  async addMember(id_project: string, email: AddMemberDto, user: User): Promise<any> {
    const foundProject = await this.projectRepository.findOne({ where: { id: id_project, manager: user}});
    const foundMemberAdd = await this.userService.findOne(email)

    const foundProject_Members = await this.projects_membersRepository.findOne({ where: { project: foundProject, user: foundMemberAdd}});

    if(!foundProject_Members) {
      const projects_members = this.projects_membersRepository.create({
        project: foundProject,
        user: foundMemberAdd,
      })
      
      delete projects_members.user.password

      await this.projects_membersRepository.save(projects_members);
      return DataReponse('Add member successfully', projects_members)
    }else {
      return DataReponse(`Member has ID ${foundMemberAdd.id} was added before`, {})
    }
  }

  async deleteMember(id_project: string, email: DeleteMember, user: User): Promise<any> {
    const foundProject = await this.projectRepository.findOne({ where: { id: id_project, manager: user}});
    const foundMemberDelete = await this.userService.findOne(email)
    
    const result = await this.projects_membersRepository.delete({ project: foundProject, user: foundMemberDelete});
    
    if(result.affected === 0) {
      throw new NotFoundException(`User with ID ${foundMemberDelete.id} not found`)
    }else {
      return DataReponse('Delete member successfully', {})
    }
  }

  async getAllMemberInProject(id_project: string) : Promise<any> {
    const result = await this.projects_membersRepository.find({ where: { projectId: id_project}})
    const promiseUsersResult = result.map(async (res) => {
      const foundUser = await this.projects_membersRepository.findOne({where: { id: res.id }})
      const foundUserDetail = await this.userService.findOne({ where: { id: foundUser.userId}});
      delete foundUserDetail.password;   
      delete foundUserDetail.projectsAssigned;   
      return foundUserDetail;
    })
    const UsersResult = await Promise.all(promiseUsersResult);


    return DataReponse(`All member in project has ID ${id_project}:`, UsersResult)
  }
}
