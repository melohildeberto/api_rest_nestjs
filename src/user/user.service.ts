import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // CREATE
  async create(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
      throw new BadRequestException('Senha obrigatória.');
    }
    try {
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(userData.password, salt);
      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      const err = error as any;
      if (err.code === '23505') { // código de violação de unique constraint no Postgres
        throw new ConflictException('Email já está em uso.');
      }
      throw new InternalServerErrorException(err.message || 'Erro ao criar usuário.');
    }
  }

  // READ
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true, role: true, name: true },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  // UPDATE
  async update(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    try {
      if (updateData.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }
      Object.assign(user, updateData);
      return await this.userRepository.save(user);
    } catch (error) {
      const err = error as any;
      if (err.code === '23505') {
        throw new ConflictException('Email já está em uso.');
      }
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    try {
      await this.userRepository.remove(user);
    } catch {
      throw new InternalServerErrorException('Erro ao remover usuário.');
    }
  }
}
