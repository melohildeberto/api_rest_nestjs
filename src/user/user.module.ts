import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { User } from './user.entity.js';


@Module({
  imports: [TypeOrmModule.forFeature([User])], // registra o repositório da entidade
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // exporta caso outros módulos precisem usar
})
export class UserModule {}
