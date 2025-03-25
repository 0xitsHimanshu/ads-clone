// @src/ad-groups/ad-groups.service.ts

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

  async update(
    id: string,
    updateAdGroupDto: Partial<AdGroup>,
  ): Promise<AdGroup> {
    const updatedAdGroup = await this.adGroupModel
      .findByIdAndUpdate(id, updateAdGroupDto, { new: true })
      .exec();

    if (!updatedAdGroup) {
      throw new Error(`Ad Group with id ${id} not found`);
    }

    return updatedAdGroup;
  }

  async delete(id: string): Promise<AdGroup> {
    const deletedAdGroup = await this.adGroupModel.findByIdAndDelete(id).exec();

    if (!deletedAdGroup) {
      throw new Error(`Ad Group with id ${id} not found`);
    }

    return deletedAdGroup;
  }
}
