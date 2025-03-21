import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AdsService } from './ads.service';
import { Ad } from './ad.schema';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  create(@Body() adDto: Partial<Ad>): Promise<Ad> {
    return this.adsService.create(adDto);
  }

  @Get()
  findAll(): Promise<Ad[]> {
    return this.adsService.findAll();
  }

  @Get('ad-group/:adGroupId')
  findByAdGroup(@Param('adGroupId') adGroupId: string): Promise<Ad[]> {
    return this.adsService.findByAdGroup(adGroupId);
  }
}