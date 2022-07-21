/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator'
import { ProjectStatusEnum } from '../entities/project-status.enum';

export class UpdateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  projectCode: string;

  @ApiProperty()
  @IsNotEmpty()
  status: ProjectStatusEnum;

  @ApiProperty()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;
  
  @ApiProperty()
  @IsNotEmpty()
  maximum_members: number

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  managerId?: string;
}
