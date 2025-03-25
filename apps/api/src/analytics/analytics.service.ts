import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ad } from '../ads/ad.schema';
import { Campaign } from '../campaigns/campaign.schema';
import { AdGroup } from '../ad-groups/ad-group.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Ad.name) private adModel: Model<Ad>,
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    @InjectModel(AdGroup.name) private adGroupModel: Model<AdGroup>,
  ) {}

  // Overview Analytics
  async getOverviewAnalytics(): Promise<any> {
    const ads = await this.adModel.find().exec();
    const campaigns = await this.campaignModel.find().exec();

    const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
    const totalSpend = campaigns.reduce(
      (sum, campaign) => sum + campaign.budget,
      0,
    );
    const conversionRate = totalImpressions
      ? (totalClicks / totalImpressions) * 100
      : 0;

    // Placeholder trends (replace with real comparison logic if historical data exists)
    const impressionsTrend = totalImpressions > 100000 ? 'up' : 'down'; // Example logic
    const clicksTrend = totalClicks > 5000 ? 'up' : 'down';
    const conversionRateTrend = conversionRate > 3 ? 'down' : 'up';
    const spendTrend = totalSpend > 4000 ? 'up' : 'down';

    return {
      totalImpressions,
      totalClicks,
      conversionRate: conversionRate.toFixed(1),
      totalSpend,
      impressionsTrend,
      clicksTrend,
      conversionRateTrend,
      spendTrend,
    };
  }

  // Performance Trends (last 30 days)
  async getPerformanceTrends(): Promise<any> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ads = await this.adModel.find().exec();
    const dailyData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    // Simulate daily impressions and clicks (replace with real tracking if available)
    const impressions = dailyData.map(() =>
      Math.floor(
        ads.reduce((sum, ad) => sum + ad.impressions, 0) / 30 +
          Math.random() * 1000,
      ),
    );
    const clicks = dailyData.map(() =>
      Math.floor(
        ads.reduce((sum, ad) => sum + ad.clicks, 0) / 30 + Math.random() * 100,
      ),
    );

    return {
      dates: dailyData,
      impressions,
      clicks,
    };
  }

  // Top Performing Campaigns
  async getTopCampaigns(): Promise<any[]> {
    const campaigns = await this.campaignModel.find().exec();
    const adGroups = await this.adGroupModel
      .find()
      .populate('campaignId')
      .exec();
    const ads = await this.adModel.find().populate('adGroupId').exec();

    const campaignMetrics = campaigns.map((campaign) => {
      const relatedAdGroups = adGroups.filter(
        (ag) => ag.campaignId.toString() === String(campaign._id),
      );
      const adGroupIds = relatedAdGroups.map((ag) => ag._id);
      const relatedAds = ads.filter((ad) => adGroupIds.includes(ad.adGroupId));

      const impressions = relatedAds.reduce(
        (sum, ad) => sum + ad.impressions,
        0,
      );
      const clicks = relatedAds.reduce((sum, ad) => sum + ad.clicks, 0);
      const ctr = impressions ? (clicks / impressions) * 100 : 0;

      return {
        name: campaign.name,
        impressions,
        ctr,
      };
    });

    return campaignMetrics.sort((a, b) => b.ctr - a.ctr).slice(0, 3); // Top 3
  }

  // Campaign Performance
  async getCampaignPerformance(): Promise<any[]> {
    const campaigns = await this.campaignModel.find().exec();
    const adGroups = await this.adGroupModel
      .find()
      .populate('campaignId')
      .exec();
    const ads = await this.adModel.find().populate('adGroupId').exec();

    return campaigns.map((campaign) => {
      const relatedAdGroups = adGroups.filter(
        (ag) => ag.campaignId.toString() === String(campaign._id),
      );
      const adGroupIds = relatedAdGroups.map((ag) => ag._id);
      const relatedAds = ads.filter((ad) => adGroupIds.includes(ad.adGroupId));

      const impressions = relatedAds.reduce(
        (sum, ad) => sum + ad.impressions,
        0,
      );
      const clicks = relatedAds.reduce((sum, ad) => sum + ad.clicks, 0);
      const ctr = impressions ? (clicks / impressions) * 100 : 0;
      const spend = campaign.budget; // Assuming budget is spend for simplicity

      return {
        name: campaign.name,
        impressions,
        clicks,
        ctr,
        spend,
      };
    });
  }

  // Ad Performance
  async getAdPerformance(): Promise<any[]> {
    const ads = await this.adModel.find().exec();
    return ads.map((ad) => ({
      title: ad.title,
      impressions: ad.impressions,
      clicks: ad.clicks,
      ctr: ad.impressions ? (ad.clicks / ad.impressions) * 100 : 0,
      spend: ad.maxCpc * ad.clicks, // Simple spend calculation (maxCpc * clicks)
    }));
  }
}
