import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview() {
    return this.analyticsService.getOverviewAnalytics();
  }

  @Get('trends')
  async getTrends() {
    return this.analyticsService.getPerformanceTrends();
  }

  @Get('top-campaigns')
  async getTopCampaigns() {
    return this.analyticsService.getTopCampaigns();
  }

  @Get('campaigns')
  async getCampaignPerformance() {
    return this.analyticsService.getCampaignPerformance();
  }

  @Get('ads')
  async getAdPerformance() {
    return this.analyticsService.getAdPerformance();
  }
}