import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
