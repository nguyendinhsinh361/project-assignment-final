/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SendEmailResetDto {
    @ApiProperty()
    @IsString()
    token: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    password_confirm: string;

}