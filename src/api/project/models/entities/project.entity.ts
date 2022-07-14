/* eslint-disable prettier/prettier */

import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/api/user/models/entities/user.entity';
import { ProjectStatusEnum } from './project-status.enum';
import { Exclude } from 'class-transformer';
import { Task } from 'src/api/task/models/entities/task.entity';
import { Projects_Members } from './projects_members.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    name: string;

    @Column({ unique: true, nullable: true })
    projectCode: string;

    @Column({ nullable: true })
    startDate: string;

    @Column({ nullable: true })
    endDate: string;

    @Column({ default: ProjectStatusEnum.PENDING})
    status: string;

    @Column({ nullable: true })
    price: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.projectsManager, { eager: false })
    @Exclude({ toPlainOnly: true })
    manager: User;

    @OneToMany(() => Task, (task) => task.project, { eager: true})
    tasks: Task[];

    @OneToMany(() => Projects_Members , (user: Projects_Members) => user.project, {eager: true})
    @JoinTable({ name: 'projects_members'})
    members: User[];
}


