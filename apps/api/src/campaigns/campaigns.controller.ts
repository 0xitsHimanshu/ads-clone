import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './campaign.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() campaignDto: Partial<Campaign>): Promise<Campaign> {
    return this.campaignsService.create(campaignDto);
  }

  @Get()
  findAll(): Promise<Campaign[]> {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Campaign> {
    return this.campaignsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() campaignDto: Partial<Campaign>,
  ): Promise<Campaign> {
    return this.campaignsService.update(id, campaignDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Campaign> {
    return this.campaignsService.delete(id);
  }
}
