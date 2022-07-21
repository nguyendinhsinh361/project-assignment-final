/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserI } from '../models/entities/user.interface';
import { User } from '../models/entities/user.entity';
import { Repository } from 'typeorm';
import { DataReponse } from 'src/shared/data-reponse';
import { UpdateProfile } from '../models/dto/update-profile.dto';
import * as fs from 'fs';
import { MessageFailedI, MessageSuccessfullyI } from 'src/shared/message.interfacae';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<any> {
    const allUsers =  await this.userRepository.find();
    return DataReponse(MessageSuccessfullyI.GET_MANY_MEMBERS, allUsers)
  }

  async findById(id: string): Promise<any> {
    const foundUser = await this.userRepository.findOne(id);
    if(foundUser) {
      return DataReponse(MessageSuccessfullyI.GET_DETAIL, foundUser)
    }else {
      throw new NotFoundException(MessageFailedI.NOT_FOUND)
    }

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
    delete user.password
    return DataReponse(MessageSuccessfullyI.UPDATE, user)
  }

  async authorizeAdmin(id: string): Promise<any> {
    const findUser = await this.userRepository.findOne(id);
    if(findUser) {
      findUser.role = 'admin';
      const resultUser = await this.userRepository.save(findUser);
      return DataReponse(MessageSuccessfullyI.GIVE_PERMISSIONS, resultUser)
    }else {
      return DataReponse(MessageFailedI.GIVE_PERMISSIONS, {})
    }
  }

  async watchInfo(user: User) : Promise<any> {
    return DataReponse(MessageSuccessfullyI.GET_DETAIL, user)
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
      throw new NotFoundException(MessageFailedI.NOT_FOUND)
    }else {
      return DataReponse(MessageSuccessfullyI.DELETE, {})
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