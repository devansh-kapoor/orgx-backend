import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './login.service';
import { JwtStrategy } from './strategy/jwt.stratergy';
import { LoginController } from './login.controller';
import { LoginQueries } from './loginQueries';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LoginService, JwtStrategy, LoginQueries],
  exports: [JwtModule],
  controllers: [LoginController],
})
export class LoginModule {}
