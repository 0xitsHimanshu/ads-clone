import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdGroup } from './ad-group.schema';

@Injectable()
export class AdGroupsService {
  constructor(
    @InjectModel(AdGroup.name) private adGroupModel: Model<AdGroup>,
  ) {}

  async create(adGroupDto: Partial<AdGroup>): Promise<AdGroup> {
    const createdAdGroup = new this.adGroupModel(adGroupDto);
    return createdAdGroup.save();
  }

  async findAll(): Promise<AdGroup[]> {
    return this.adGroupModel.find().populate('campaignId').exec();
  }

  async findByCampaign(campaignId: string): Promise<AdGroup[]> {
    return this.adGroupModel.find({ campaignId }).populate('campaignId').exec();
  }
}
