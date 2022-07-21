/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/api/auth/guards/jwt-auth.guard";
import { UserRoleEnum } from "src/api/user/models/entities/user-role.enum";
import { User } from "src/api/user/models/entities/user.entity";
import { GetUser, Roles } from "src/shared/config.decorator";
import { GetFilterDto } from "src/shared/get-filter.dto";
import { RoleAdminOrSuperAdmin } from "src/shared/role-admin-or-spa.guard";
import { AddMemberDto } from "../models/dto/add-member.dto";
import { CreateProjectDto } from "../models/dto/create-project.dto";
import { DeleteMember } from "../models/dto/delete-member.dto";
import { UpdateProjectDto } from "../models/dto/update-project.dto";
import { Project } from "../models/entities/project.entity";
import { ProjectService } from "../services/project.service";

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private projectService: ProjectService,
  ) {}

  @Get('/get-many')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Search by condition',
  })
  @ApiOperation({ summary: 'Search by condition' })
  getFilters(
    @Query() filterDto: GetFilterDto,
    @GetUser() user: User,
    ): Promise<any> {
      return this.projectService.getFilters(filterDto, user);
  }

  @Post('/create')
  @ApiBearerAuth()
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
  @ApiResponse({
    status: 200,
    description: 'Create project',
  })
  @ApiOperation({ summary: 'Create project' })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
    ): Promise<any> {
      return this.projectService.createProject(createProjectDto, user);
  }

  @Delete('/delete/:id_project')
  @ApiBearerAuth()
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
  @ApiResponse({
    status: 200,
    description: 'Delete project',
  })
  @ApiOperation({ summary: 'Delete project' })
  delete(
    @Param('id_project') id: string,
    @GetUser() user: User,
    ): Promise<any> {
      return this.projectService.delete(id, user);
  }

  @Patch('/update/:id_project')
  @ApiBearerAuth()
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
  @ApiResponse({
    status: 200,
    description: 'Update project',
  })
  @ApiOperation({ summary: 'Update project' })
  update(
    @Param('id_project') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: User,
    ): Promise<any> {
      return this.projectService.update(id, updateProjectDto, user);
  }

  @Get('/get-detail/:id_project')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Find project by id',
  })
  @ApiOperation({ summary: 'Find project by id' })
  getById(@Param('id_project') id:string): Promise<Project> {
    return this.projectService.getById(id);
  }

  @Post('/add_member/:id_project')
  @ApiBearerAuth()
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
  @ApiResponse({
    status: 200,
    description: 'Add member to project',
  })
  @ApiOperation({ summary: 'Add member to project' })
  addMember(
    @Param('id_project') id_project: string,
    @Body() email: AddMemberDto,
    @GetUser() user: User,
    ): Promise<any> {
      return this.projectService.addMember(id_project, email, user);
  }

  @Delete('/delete_member/:id_project')
  @ApiBearerAuth()
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
  @ApiResponse({
    status: 200,
    description: 'Delete member from project',
  })
  @ApiOperation({ summary: 'Delete member from project' })
  deleteMember(
    @Param('id_project') id_project: string,
    @Body() email: DeleteMember,
    @GetUser() user: User,
    ): Promise<any> {
      return this.projectService.deleteMember(id_project, email, user);
  }

  @Get('/get_all_members/:id_project')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Get all members in project',
  })
  @ApiOperation({ summary: 'Get all members in project' })
  getAllMemberInProject(
      @Param('id_project') id_project: string,
    ): Promise<any> {
      return this.projectService.getAllMemberInProject(id_project);
  }
}
