/* eslint-disable prettier/prettier */

import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/api/auth/auth.module';
import { Project } from 'src/api/project/models/entities/project.entity';
import { Projects_Members } from 'src/api/project/models/entities/projects_members.entity';
import { ProjectService } from 'src/api/project/services/project.service';
import { AccountEntity } from 'src/api/user/models/entities/account.entity';
import { User } from 'src/api/user/models/entities/user.entity';
import { AccountService } from 'src/api/user/services/account.service';
import { UserService } from 'src/api/user/services/user.service';
import { TaskController } from '../controller/task.controller';
import { Task } from '../models/entities/task.entity';
import { TaskService } from '../services/task.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Task, Project, AccountEntity,User, Projects_Members]),
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: '0.0.0.0',
        port: 1025,
      },
      defaults: {
        from: 'admin@example.com'
      }
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService, AccountService, UserService, ProjectService]
})
export class TasksModule {}
