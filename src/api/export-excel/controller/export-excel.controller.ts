/* eslint-disable prettier/prettier */

import { Controller, Get, Header, Param, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/api/auth/guards/jwt-auth.guard";
import { UserRoleEnum } from "src/api/user/models/entities/user-role.enum";
import { User } from "src/api/user/models/entities/user.entity";
import { GetUser, Roles } from "src/shared/config.decorator";
import { ExportExcelService } from "../services/export-excel.service";
import { Response } from 'express'
import { RoleAdminOrSuperAdmin } from "src/shared/role-admin-or-spa.guard";
import { RoleSuperAdmin } from "src/shared/role-super-admin.guard";


@ApiTags('Excel')
@Controller('excel')
export class ExportExcelController {
    constructor(
        private exportExcelService: ExportExcelService
    ) {}

    @Get('/export-all')
    @Header('Content-Type', 'text/xlsx')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.SUPER_ADMIN)
    @UseGuards(JwtAuthGuard, RoleSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Get all reports',
    })
    @ApiOperation({ summary: 'Get all reports' })
    async getAllReport(
        @GetUser() user: User,
        @Res() res: Response,
    ) {
        const result = await this.exportExcelService.getAllReportSPA(user);
        console.log(result);
        res.download(`${result}`)
    }

    @Get('/:id_project/export-detail')
    @ApiBearerAuth()
    @Roles(UserRoleEnum.USER)
    @UseGuards(JwtAuthGuard, RoleAdminOrSuperAdmin)
    @ApiResponse({
        status: 200,
        description: 'Get report detail',
    })
    @ApiOperation({ summary: 'Get report detail' })
    async getReportDetail(
        @Param('id_project') id_project: string,
        @GetUser() user: User,
        @Res() res: Response,
    ): Promise<any> {
        const result = await this.exportExcelService.getReportDetail(id_project, user);
        console.log(result);
        res.download(`${result}`)
    }
}
