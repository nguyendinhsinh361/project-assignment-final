/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator'
import { TaskLevelEnum } from '../entities/task-level.enum';
import { TaskPriorityEnum } from '../entities/task-priority.enum';
import { TaskStatusEnum } from '../entities/task-status.enum';
import { TaskTypeEnum } from '../entities/task-type.enum';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  reporter: string;

  @ApiProperty()
  @IsNotEmpty()
  status: TaskStatusEnum;

  @ApiProperty()
  @IsNotEmpty()
  priority: TaskPriorityEnum;

  @ApiProperty()
  @IsNotEmpty()
  type: TaskTypeEnum;

  @ApiProperty()
  @IsNotEmpty()
  level: TaskLevelEnum;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: Express.Multer.File;

}
