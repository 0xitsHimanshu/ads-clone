// @src/ads/ads.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { Ad, AdSchema } from './ad.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ad.name, schema: AdSchema }])],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}