import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AdGroupsService } from './ad-groups.service';
import { AdGroup } from './ad-group.schema';

@Controller('ad-groups')
export class AdGroupsController {
  constructor(private readonly adGroupsService: AdGroupsService) {}

  @Post()
  create(@Body() adGroupDto: Partial<AdGroup>): Promise<AdGroup> {
    return this.adGroupsService.create(adGroupDto);
  }

  @Get()
  findAll(): Promise<AdGroup[]> {
    return this.adGroupsService.findAll();
  }

  @Get('campaign/:campaignId')
  findByCampaign(@Param('campaignId') campaignId: string): Promise<AdGroup[]> {
    return this.adGroupsService.findByCampaign(campaignId);
  }
}
