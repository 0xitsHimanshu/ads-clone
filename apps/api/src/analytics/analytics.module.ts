import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Ad, AdSchema } from '../ads/ad.schema';
import { Campaign, CampaignSchema } from '../campaigns/campaign.schema';
import { AdGroup, AdGroupSchema } from '../ad-groups/ad-group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ad.name, schema: AdSchema },
      { name: Campaign.name, schema: CampaignSchema },
      { name: AdGroup.name, schema: AdGroupSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}