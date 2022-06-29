/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async generateJwt(email: string): Promise<string> {
        return this.jwtService.signAsync({email}, {secret: process.env.JWT_SECRET, expiresIn: '1d'});
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12)
    }

    async comparePasswords(password: string, storedPasswordHash: string): Promise<any> {
        return await bcrypt.compare(password, storedPasswordHash);
    }
}