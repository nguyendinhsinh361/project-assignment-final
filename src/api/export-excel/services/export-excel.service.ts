/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { data } from "src/shared/export-excel";
import { Workbook } from 'exceljs'
import * as tmp from "tmp"
import { User } from "src/api/user/models/entities/user.entity";

@Injectable()
export class ExportExcelService {

    async downloadExcel() {
        if(!data) {
            throw new NotFoundException('No data to dowload')
        }

        const rows = [];
        data.forEach(doc => {
            rows.push(Object.values(doc))
        })

        const book = new Workbook()
        const sheet = book.addWorksheet('sheet1')
        rows.unshift(Object.keys(data[0]))

        sheet.addRows(rows)
        const File = await new Promise((resolve, reject) => {
            tmp.file({ discardDescriptor: true, prefix: 'MyExcelSheet', postfix: '.xlsx', mode: parseInt('0600', 8)}, async(err, file) => {
                if(err) 
                    throw new BadRequestException(err)
                book.xlsx.writeFile(file).then(_ => {
                    resolve(file)
                }).catch(err => {
                    throw new BadRequestException(err)
                })
            })
        })
        
        return File
        
    }
    

    // async getAllReport(user: User): Promise<any> {
    //     // const result = await this.projectRepository.find({})
    //     return 
    // }
    // async getReportDetail(user: User): Promise<any> {
    //     return 
    // }
}
