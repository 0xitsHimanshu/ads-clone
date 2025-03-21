import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/user.schema';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret:
        '6e6892891ed15df5f3c84b35f80aa1077fb89cc59884f19f37656d8466489c9d12150627d89c5574c96e902b57960e7bc37f2955d5c007d7c5bee7bac186e27d03c85a4a9d6f87e9d8316043511deb65eabb0fdbeec0c080cec23b455edeea02607b1034676639e2dc9214a63f1a7145006d15b1d5049ec889eba1e163946599eba0dfa3e1257a8e0f7c90e9de4b5c3666cd37be5f4413668b25290d5dc444930e49b504ff79b6252d0b730ff60554a0a4f577ae97d9f9bdeb201a1e68c5c7ee56c91a998bbd2bcd9adf22a3dec88ec27deef11a856af9ce59fc1ccb9e44fa2836028be3c8a95c629f0ec2777c9a6c37bc3321562be82905554eb26d231dc3b8', // Use a secure key in production
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
