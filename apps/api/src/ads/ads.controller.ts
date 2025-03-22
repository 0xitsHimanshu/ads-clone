import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { Ad } from './ad.schema';
import { AuthGuard } from '@nestjs/passport';

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

  @Patch(':id/impression')
  @UseGuards(AuthGuard('jwt'))
  incrementImpression(@Param('id') id: string) {
    return this.adsService.incrementImpression(id);
  }

  @Patch(':id/click')
  @UseGuards(AuthGuard('jwt'))
  incrementClick(@Param('id') id: string) {
    return this.adsService.incrementClick(id);
  }
}
