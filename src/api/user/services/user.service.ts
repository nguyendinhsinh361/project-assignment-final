/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserI } from '../models/entities/user.interface';
import { User } from '../models/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<UserI[]> {
    return this.userRepository.find();
  }

  async findOne(condition: any): Promise<UserI> {
    return this.userRepository.findOne(condition);
  }

  async save(condition: any): Promise<UserI> {
    return this.userRepository.save(condition);
  }

  async update(id: number, data: any): Promise<any> {
    return this.userRepository.update(id, data);
  }

  create(data: any) {
    return this.userRepository.create(data);
  }
}