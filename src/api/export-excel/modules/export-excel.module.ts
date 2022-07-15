/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/api/auth/auth.module";
import { User } from "src/api/user/models/entities/user.entity";
import { ExportExcelController } from "../controller/export-excel.controller";
import { ExportExcelService } from "../services/export-excel.service";



@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [ExportExcelController],
  providers: [ExportExcelService],
  exports: [ExportExcelService]
})
export class ExportExcelModule {}