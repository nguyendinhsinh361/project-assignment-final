/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/api/auth/auth.module";
import { RolesGuard } from "src/shared/roles.guard";
import { ProjectController } from "../controller/project.controller";
import { Project } from "../models/entities/project.entity";
import { ProjectService } from "../services/project.service";


@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Project]),
    AuthModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}