/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Workbook } from 'exceljs'
import * as tmp from "tmp"
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "src/api/project/models/entities/project.entity";
import { Repository } from "typeorm";
import { User } from "src/api/user/models/entities/user.entity";
import { Projects_Members } from "src/api/project/models/entities/projects_members.entity";
import { ReportSuperAdminI } from "src/shared/report-spa.interface";
import { ReportAdminI } from "src/shared/report-admin.interface";
import { DataReponse } from "src/shared/data-reponse";

@Injectable()
export class ExportExcelService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Projects_Members)
        private projects_membersRepository: Repository<Projects_Members>,
    ){}

    async getAllMembers(user: User) {
        const allProject = await this.projectRepository.find({})
        const length = allProject.length
        const allMembers = [];
        const arrMembers = allProject.map(async (req) => {
            const projectDetail = await this.projectRepository.findOne({where: { id: req.id }})
            allMembers.push(projectDetail.members.length);
            return allMembers
        })
        const index = await arrMembers[length-1]
        let count = 0;
        for(let i = 0 ; i < index.length ; i++) {
            count += index[i];
        }
        return count
    }

    async getDataReponseSPA(user: User): Promise<ReportSuperAdminI[]> {

        const allProject = await this.projectRepository.find({})
        const allMembers = await this.getAllMembers(user)
        const project_in_progress = function(reqData) {
            let count = 0;
            reqData.forEach(req => {
                if(req.status == 'in_progress') {
                    count ++;
                }
            })
            return count;
        }

        const project_completed = function(reqData) {
            let count = 0;
            reqData.forEach(req => {
                if(req.status == 'completed') {
                    count ++;
                }
            })
            return count;
        }

        const project_failed = function(reqData) {
            let count = 0;
            reqData.forEach(req => {
                if(req.status == 'failed') {
                    count ++;
                }
            })
            return count;
        }

        const project_pending = function(reqData) {
            let count = 0;
            reqData.forEach(req => {
                if(req.status == 'pending') {
                    count ++;
                }
            })
            return count;
        }

        const member_per_project_rate = function(reqData) {
            let ratio = 0;
            const totalMembers = allMembers;
            reqData.forEach(req => {
                const totalProjects = reqData.length;
                const maximum_members = req.maximum_members;
                ratio = Number((totalMembers/(maximum_members*totalProjects)).toFixed(3))*100;
            })
            return `${ratio} %`;
        }

        // Let's say the average salary of the members = 500$
        // Costs incurred = price_project / 50
        const average_project_revenue = function(reqData) {
            let revenue = 0;
            const salary_total_members = allMembers*500;
            reqData.forEach(req => {
                const total_price = req.price;
                const cost_incurred = (total_price/50).toFixed(3)
                revenue += (total_price-salary_total_members-Number(cost_incurred));
            })
            return `${revenue} $`;
        }

        if(allProject) {
            const data = [
                {
                    project_in_progress: project_in_progress(allProject),
                    project_completed: project_completed(allProject),
                    project_failed: project_failed(allProject),
                    project_pending: project_pending(allProject),
                    member_per_project_rate: member_per_project_rate(allProject),
                    average_project_revenue: average_project_revenue(allProject),
                }
            ]
            
            return data;
        }else {
            return null;
        }
    }

    async downloadExcel(data, user) {
        const dataRes = await data;
        if(!dataRes) {
            throw new NotFoundException('No data to dowload')
        }

        const rows = [];
        dataRes.forEach(doc => {
            rows.push(Object.values(doc))
        })

        const book = new Workbook()
        const sheet = book.addWorksheet('sheet1')
        rows.unshift(Object.keys(dataRes[0]))

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
    async getAllReportSPA(user: User) {
        const data = this.getDataReponseSPA(user)
        return this.downloadExcel(data, user)
    }
    

    async getDataReponseAdmin(id_project: string, user: User): Promise<ReportAdminI[]> {
        const projectDetail = await this.projectRepository.findOne({ where: { id: id_project, manager: user }});
        
        if(projectDetail) {
            const arrTasks = projectDetail.tasks;
            const task_in_progress = function(reqData) {
                let count = 0;
                reqData.forEach(req => {
                    if(req.status == 'in_progress') {
                        count ++;
                    }
                })
                return count;
            }

            const task_completed = function(reqData) {
                let count = 0;
                reqData.forEach(req => {
                    if(req.status == 'completed') {
                        count ++;
                    }
                })
                return count;
            }

            const task_failed = function(reqData) {
                let count = 0;
                reqData.forEach(req => {
                    if(req.status == 'failed') {
                        count ++;
                    }
                })
                return count;
            }

            const task_pending = function(reqData) {
                let count = 0;
                reqData.forEach(req => {
                    if(req.status == 'pending') {
                        count ++;
                    }
                })
                return count;
            }

            const total_bug = function(reqData) {
                let count = 0;
                reqData.forEach(req => {
                    if(req.type == 'bug') {
                        count ++;
                    }
                })
                return count;
            }

            const total_task = function(reqData) {
                let count = 0;
                reqData.forEach(req => {
                    if(req.type == 'task') {
                        count ++;
                    }
                })
                return count;
            }

            const bug_per_task_rate = function(reqData) {
                const bug = total_bug(reqData);
                const task = total_task(reqData);
                return `${Number((bug/task).toFixed(3))*100} %`
            }
            
            const data = [
                { 
                    task_in_progress: task_in_progress(arrTasks),
                    task_completed: task_completed(arrTasks),
                    task_failed: task_failed(arrTasks),
                    task_pending: task_pending(arrTasks),
                    total_bug: total_bug(arrTasks),
                    bug_per_task_rate: bug_per_task_rate(arrTasks),
                }
            ];
            return data;
        }else {
            return null
        }
    }

    async getReportDetail(id_project: string, user: User) {
        const data = this.getDataReponseAdmin(id_project, user);
        return this.downloadExcel(data, user)
    }
}
