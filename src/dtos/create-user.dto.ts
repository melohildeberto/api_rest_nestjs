import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsEmail, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Hildeberto Melo' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string;

  @ApiProperty({ example: 'hildeberto@email.com' })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  @IsEmail({}, { message: 'Formato de email inválido.' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @Length(6, 20, { message: 'A senha deve ter entre 6 e 20 caracteres.' })
  password: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin'], default: 'user' })
  @IsOptional()
  @IsIn(['user', 'admin'], { message: 'O papel deve ser "user" ou "admin".' })
  role?: string;
}
