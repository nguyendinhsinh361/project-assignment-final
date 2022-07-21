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

  async findAll(): Promise<any> {
    const allUsers =  await this.userRepository.find();
    return DataReponse(`Get all users successfully`, allUsers)
  }

  async findById(id: string): Promise<any> {
    const foundUser = await this.userRepository.findOne(id);
    return DataReponse(`Find user by id ${id} successfully`, foundUser)

  }

  async updateProfile(id: number, file: Express.Multer.File, updateProfile: UpdateProfile): Promise<any> {
    const findUser = await this.userRepository.findOne(id);
    if (file) {
      if (fs.existsSync(findUser.avatar)) {
          fs.unlinkSync(`./${findUser.avatar}`);
      }
      findUser.avatar = file.path;
  }
    
    const user = await this.userRepository.save(findUser);
    return DataReponse(`Update user by id ${id} successfully`, user)
  }

  async authorizeAdmin(id: string): Promise<any> {
    const findUser = await this.userRepository.findOne(id);
    findUser.role = 'admin';
    const resultUser = await this.userRepository.save(findUser);
    return DataReponse(`Give permission user has id ${id} to admin successfully`, resultUser)
  }

  async watchInfo(user: User) : Promise<any> {
    return DataReponse('Get Detail info user logged in successfully', user)
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
      throw new NotFoundException(`Task with ID ${id} not found`)
    }else {
      return DataReponse('Delete successfully', {})
    }
  }

  async update(id: number, data: any): Promise<any> {
    const updateUser = await this.userRepository.update(id, data);
    return updateUser
  }

  async create(data: any) {
    const user = await this.userRepository.create(data);
    return user
  }
}