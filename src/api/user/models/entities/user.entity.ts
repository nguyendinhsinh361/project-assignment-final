/* eslint-disable prettier/prettier */

import { Project } from 'src/api/project/models/entities/project.entity';
import { Projects_Members } from 'src/api/project/models/entities/projects_members.entity';
import { Column, CreateDateColumn, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRoleEnum } from './user-role.enum';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({ default: null })
    avatar: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column( { default: UserRoleEnum.USER })
    role: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({default: false})
    isActive: boolean;

    @OneToMany(() => Project, (project) => project.manager, { eager: true})
    projectsManager: Project[];

    @OneToMany(() => Projects_Members, (project: Projects_Members) => project.user, { eager: true })
    @JoinTable({ name: 'projects_members'})
    projectsAssigned: Project[];
}


