/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/api/auth/guards/jwt-auth.guard";
import { UserRoleEnum } from "src/api/user/models/entities/user-role.enum";
import { User } from "src/api/user/models/entities/user.entity";
import { GetUser, Roles } from "src/shared/config.decorator";
import { GetFilterDto } from "src/shared/get-filter.dto";
import { ReportAdminI } from "src/shared/report-admin.interface copy";
import { ReportSuperAdminI } from "src/shared/report-spa.interface";
import { RoleAdminOrSuperAdmin, RoleSuperAdmin } from "src/shared/roles.guard";
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

  @Get()
  @ApiBearerAuth()
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
  @ApiResponse({
    status: 200,
    description: 'Search by condition',
  })
  @ApiOperation({ summary: 'Search by condition' })
  getFilters(
    @Query() filterDto: GetFilterDto,
    @GetUser() user: User,
    ): Promise<Project[]> {
      return this.projectService.getFilters(filterDto, user);
  }

  @Post()
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
    ): Promise<Project> {
      return this.projectService.createProject(createProjectDto, user);
  }

  @Delete('/:id_project')
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

  @Patch('/:id_project')
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
    ): Promise<Project> {
      return this.projectService.update(id, updateProjectDto, user);
  }

  @Get('/:id_project')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Find project by id',
  })
  @ApiOperation({ summary: 'Find project by id' })
  getById(@Param('id_project') id:string): Promise<Project> {
    return this.projectService.getById(id);
  }

  @Post('/:id_project/add_member')
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
    ): Promise<Project> {
      return this.projectService.addMember(id_project, email, user);
  }

  @Delete('/:id_project/delete_member')
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
    ): Promise<Project> {
      return this.projectService.deleteMember(id_project, email, user);
  }

  @Get('/:id_project/get_all_members')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Get all members in project',
  })
  @ApiOperation({ summary: 'Get all members in project' })
  getAllMemberInProject(
      @Param('id_project') id_project: string,
    ): Promise<Project[]> {
      return this.projectService.getAllMemberInProject(id_project);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(UserRoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RoleSuperAdmin)
  @ApiResponse({
    status: 200,
    description: 'Get all reports',
  })
  @ApiOperation({ summary: 'Get all reports' })
  getAllReport(
    @GetUser() user: User,
    ): Promise<ReportSuperAdminI[]> {
      return this.projectService.getAllReport(user);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(UserRoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
  @ApiResponse({
    status: 200,
    description: 'Get report detail',
  })
  @ApiOperation({ summary: 'Get report detail' })
  getReportDetail(
    @GetUser() user: User,
    ): Promise<ReportAdminI> {
      return this.projectService.getReportDetail(user);
  }
}
