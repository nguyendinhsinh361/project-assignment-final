/* eslint-disable prettier/prettier */

import { Exclude } from 'class-transformer';
import { Project } from 'src/api/project/models/entities/project.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TaskLevelEnum } from './task-level.enum';
import { TaskPriorityEnum } from './task-priority.enum';
import { TaskStatusEnum } from './task-status.enum';
import { TaskTypeEnum } from './task-type.enum';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    title: string;

    @Column()
    description: string;

    @Column()
    reporter: string;

    @Column()
    assigneer: number;

    @Column({ default: TaskStatusEnum.PENDING})
    status: string;

    @Column()
    priority: TaskPriorityEnum;

    @Column()
    type: TaskTypeEnum;

    @Column()
    level: TaskLevelEnum;

    @Column()
    image: string;

    @Column({ default: null})
    parentId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((_type) => Project, (project) => project.tasks, { eager: false })
    @Exclude({ toPlainOnly: true })
    project: Project;    
}