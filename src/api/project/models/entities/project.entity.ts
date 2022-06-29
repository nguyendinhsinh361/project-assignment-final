/* eslint-disable prettier/prettier */

import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/api/user/models/entities/user.entity';
import { ProjectStatusEnum } from './project-status.enum';
import { Exclude } from 'class-transformer';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    name: string;

    @Column({unique: true})
    projectCode: string;

    @Column()
    startDate: string;

    @Column()
    endDate: string;

    @Column({ default: ProjectStatusEnum.PENDING})
    status: string;

    @Column()
    price: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.projects)
    manager: User;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[]
}


