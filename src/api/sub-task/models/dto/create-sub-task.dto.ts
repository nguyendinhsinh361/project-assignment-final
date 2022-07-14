/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CreateTaskDto } from "src/api/task/models/dto/create-task.dto";

export class CreateSubTaskDto extends CreateTaskDto {
    @ApiProperty()
    @IsNotEmpty()
    parentId: string;
}