import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module.js';
import { JwtStrategy } from './jwt.strategy.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET não definido no .env');
        }

        // Aqui garantimos que o expiresIn seja um número
        const expiresIn = parseInt(configService.get<string>('JWT_EXPIRES_IN') || '3600', 10);

        return {
          secret,
          signOptions: {
            expiresIn, // agora é number
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
