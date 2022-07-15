/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateProfile {
    @IsOptional()
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    avatar?: Express.Multer.File;
}