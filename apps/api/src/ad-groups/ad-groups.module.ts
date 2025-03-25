// @src/ad-groups/ad-groups-module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdGroupsController } from './ad-groups.controller';
import { AdGroupsService } from './ad-groups.service';
import { AdGroup, AdGroupSchema } from './ad-group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AdGroup.name, schema: AdGroupSchema }]),
  ],
  controllers: [AdGroupsController],
  providers: [AdGroupsService],
})
export class AdGroupsModule {}
