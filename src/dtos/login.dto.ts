import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'hildeberto@email.com' })
  @IsEmail({}, { message: 'O email deve ser válido.' })
  email: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;
}
