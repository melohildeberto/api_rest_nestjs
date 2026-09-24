import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UserService } from './user.service.js';
import { User } from './user.entity.js';
import { CreateUserDto } from '../dtos/create-user.dto.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Cadastro público
  @Post()
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  // Listar todos os usuários (protegido)
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.userService.findAll();
  }

  // Buscar usuário por ID (protegido)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  // Atualizar usuário (protegido)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ) {
    return this.userService.update(id, updateData);
  }

  // Remover usuário (protegido)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    await this.userService.remove(id);
    return { message: 'Usuário removido com sucesso.' };
  }
}
