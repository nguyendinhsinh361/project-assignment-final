/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/api/auth/auth.module';
import { Project } from 'src/api/project/models/entities/project.entity';
import { Projects_Members } from 'src/api/project/models/entities/projects_members.entity';
import { ProjectService } from 'src/api/project/services/project.service';
import { Task } from 'src/api/task/models/entities/task.entity';
import { User } from 'src/api/user/models/entities/user.entity';
import { UserService } from 'src/api/user/services/user.service';
import { SubTaskController } from '../controllers/sub-task.controller';
import { SubTaskService } from '../services/sub-task.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Task, Project, User, Projects_Members]),
    AuthModule,
  ],
  controllers: [SubTaskController],
  providers: [SubTaskService, ProjectService, UserService]
})
export class SubTaskModule {}
