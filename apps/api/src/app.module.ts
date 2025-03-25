// @src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AdGroupsModule } from './ad-groups/ad-groups.module';
import { AdsModule } from './ads/ads.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dbuser:example!234@cluster0.3v6no.mongodb.net/google-ads-clone?retryWrites=true&w=majority&appName=Cluster0',
    ),
    CampaignsModule,
    AdGroupsModule,
    AdsModule,
    AuthModule,
    AnalyticsModule,
    ProfileModule,
    BillingModule
  ],
  controllers: [AppController, ProfileController],
  providers: [AppService],
})
export class AppModule {}
