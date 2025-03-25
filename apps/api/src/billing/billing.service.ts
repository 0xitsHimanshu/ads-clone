import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './subscription.schema';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
  ) {}

  async getSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findOne({ userId })
      .exec();
    if (!subscription) throw new NotFoundException('Subscription not found');
    return subscription;
  }

  async updateSubscription(
    userId: string,
    plan: string,
  ): Promise<Subscription> {
    let subscription = await this.subscriptionModel.findOne({ userId }).exec();
    if (!subscription) {
      subscription = new this.subscriptionModel({
        userId,
        plan,
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });
    } else {
      subscription.plan = plan;
      subscription.nextBillingDate = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      );
    }
    return subscription.save();
  }
}
