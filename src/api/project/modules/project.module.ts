/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/api/auth/auth.module";
import { User } from "src/api/user/models/entities/user.entity";
import { UserService } from "src/api/user/services/user.service";
import { ProjectController } from "../controller/project.controller";
import { Project } from "../models/entities/project.entity";
import { Projects_Members } from "../models/entities/projects_members.entity";
import { ProjectService } from "../services/project.service";


@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Project, Projects_Members, User]),
    AuthModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, UserService],
  exports: [ProjectService]
})
export class ProjectModule {}