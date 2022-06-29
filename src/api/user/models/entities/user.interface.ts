/* eslint-disable prettier/prettier */

export interface UserI {
    id: number;
    name: string;
    email: string;
    password?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}