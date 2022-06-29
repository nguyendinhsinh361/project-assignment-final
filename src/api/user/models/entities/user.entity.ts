/* eslint-disable prettier/prettier */

import { Project } from 'src/api/project/models/entities/project.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRoleEnum } from './user-role.enum';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

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

    @OneToMany(() => Project, (project) => project.manager)
    projects: Project[];
}


