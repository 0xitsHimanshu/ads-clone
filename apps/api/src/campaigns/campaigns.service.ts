// @src/campaigns/campaigns.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign } from './campaign.schema';
import { Model } from 'mongoose';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
  ) {}

  async create(campaignDto: Partial<Campaign>): Promise<Campaign> {
    const createdCampaign = new this.campaignModel(campaignDto);
    return createdCampaign.save();
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignModel.find().exec();
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(id).exec();
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }

  async update(id: string, campaignDto: Partial<Campaign>): Promise<Campaign> {
    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(id, campaignDto, { new: true })
      .exec();
    if (!updatedCampaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return updatedCampaign;
  }

  async delete(id: string): Promise<Campaign> {
    const deletedCampaign = await this.campaignModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedCampaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return deletedCampaign;
  }
}
