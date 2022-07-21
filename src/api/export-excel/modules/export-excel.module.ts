/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/api/auth/auth.module";
import { Project } from "src/api/project/models/entities/project.entity";
import { Projects_Members } from "src/api/project/models/entities/projects_members.entity";
import { User } from "src/api/user/models/entities/user.entity";
import { ExportExcelController } from "../controller/export-excel.controller";
import { ExportExcelService } from "../services/export-excel.service";



@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Project, Projects_Members]),
    AuthModule,
  ],
  controllers: [ExportExcelController],
  providers: [ExportExcelService],
  exports: [ExportExcelService]
})
export class ExportExcelModule {}