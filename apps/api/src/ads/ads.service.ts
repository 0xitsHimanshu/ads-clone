import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ad } from './ad.schema';

@Injectable()
export class AdsService {
  constructor(@InjectModel(Ad.name) private adModel: Model<Ad>) {}

  async create(adDto: Partial<Ad>): Promise<Ad> {
    const createdAd = new this.adModel(adDto);
    return createdAd.save();
  }

  async findAll(): Promise<Ad[]> {
    return this.adModel.find().populate('adGroupId').exec();
  }

  async findByAdGroup(adGroupId: string): Promise<Ad[]> {
    return this.adModel.find({ adGroupId }).populate('adGroupId').exec();
  }

  async incrementImpression(id: string) {
    return this.adModel
      .findByIdAndUpdate(id, { $inc: { impressions: 1 } }, { new: true })
      .exec();
  }

  async incrementClick(id: string) {
    return this.adModel
      .findByIdAndUpdate(id, { $inc: { clicks: 1 } }, { new: true })
      .exec();
  }
}
