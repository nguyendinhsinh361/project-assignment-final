/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetIdDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    id_project?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    id_task?: string;
}