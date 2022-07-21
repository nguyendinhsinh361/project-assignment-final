/* eslint-disable prettier/prettier */

import { Exclude } from "class-transformer";
import { User } from "src/api/user/models/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";


@Entity('projects_members')
export class Projects_Members {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    projectId: string 

    @Column()
    userId: string 

    @ManyToOne((_type) => Project, (project) => project.members, { eager: false })
    @Exclude({ toPlainOnly: true })
    project: Project;     

    @ManyToOne((_type) => User, (user) => user.projectsAssigned, { eager: false })
    @Exclude({ toPlainOnly: true })
    user: User;  

}


