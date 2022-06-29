/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetTokenDto {
    @ApiProperty()
    @IsString()
    token: string;
}