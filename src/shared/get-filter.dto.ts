/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetFilterDto {
    @ApiProperty({ required: false})
    @IsOptional()
    @IsString()
    projectCode?: string;

    @ApiProperty({ required: false})
    @IsString()
    @IsOptional()
    search?: string;
}