/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserI } from '../models/entities/user.interface';
import { User } from '../models/entities/user.entity';
import { Repository } from 'typeorm';
import { DataReponse } from 'src/shared/data-reponse';
import { UpdateProfile } from '../models/dto/update-profile.dto';
import * as fs from 'fs';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<UserI[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<UserI> {
    return await this.userRepository.findOne(id);
  }

  async updateProfile(id: string, file: Express.Multer.File, updateProfile: UpdateProfile): Promise<UserI> {
    const findUser = await this.userRepository.findOne(id);
    if (file) {
      if (fs.existsSync(findUser.avatar)) {
          fs.unlinkSync(`./${findUser.avatar}`);
      }
      findUser.avatar = file.path;
  }
    
    return this.userRepository.save(findUser);
  }

  async authorizeAdmin(id: string): Promise<UserI> {
    const findUser = await this.userRepository.findOne(id);
    findUser.role = 'admin';
    return this.userRepository.save(findUser);
  }

  async watchInfo(user: User) : Promise<User> {
    return user
  }

  async findOne(condition: any): Promise<User> {
    return this.userRepository.findOne(condition);
  }

  async save(condition: any): Promise<UserI> {
    return this.userRepository.save(condition);
  }

  async delete(id: string, user: User): Promise<any> {
    const result = await this.userRepository.delete(id);
  
    if(result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }else {
      return DataReponse('Delete successfully', {})
    }
  }

  async update(id: number, data: any): Promise<any> {
    return this.userRepository.update(id, data);
  }

  create(data: any) {
    return this.userRepository.create(data);
  }
}