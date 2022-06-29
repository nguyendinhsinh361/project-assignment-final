/* eslint-disable prettier/prettier */

import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/api/auth/guards/jwt-auth.guard";
import { UserRoleEnum } from "src/api/user/models/entities/user-role.enum";
import { User } from "src/api/user/models/entities/user.entity";
import { GetUser, Roles } from "src/shared/config.decorator";
import { RolesGuard } from "src/shared/roles.guard";
import { CreateProjectDto } from "../models/dto/create-project.dto";
import { Project } from "../models/entities/project.entity";
import { ProjectService } from "../services/project.service";

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private projectService: ProjectService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
    ): Promise<Project> {
      return this.projectService.createProject(createProjectDto, user);
  }
}
