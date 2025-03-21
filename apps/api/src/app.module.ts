import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AdGroupsModule } from './ad-groups/ad-groups.module';
import { AdsModule } from './ads/ads.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dbuser:example!234@cluster0.3v6no.mongodb.net/google-ads-clone?retryWrites=true&w=majority&appName=Cluster0',
    ),
    CampaignsModule,
    AdGroupsModule,
    AdsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
