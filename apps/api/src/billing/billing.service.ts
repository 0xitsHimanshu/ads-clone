import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillingAccount } from './billing-account.schema';
import { AdsService } from '../ads/ads.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(BillingAccount.name) private billingAccountModel: Model<BillingAccount>,
    private adsService: AdsService,
  ) {}

  async getBillingAccount(userId: string): Promise<BillingAccount> {
    let account = await this.billingAccountModel.findOne({ userId }).exec();
    if (!account) {
      // Create a default billing account if none exists
      account = new this.billingAccountModel({
        userId,
        paymentMode: 'automatic',
        paymentThreshold: 50,
        balance: 0,
        accruedCosts: 0,
        invoicingEligible: false, // Set to true for eligible users in a real app
      });
      await account.save();
    }
    return account;
  }

  async updatePaymentMode(userId: string, paymentMode: string): Promise<BillingAccount> {
    let account = await this.billingAccountModel.findOne({ userId }).exec();
    if (!account) {
      account = new this.billingAccountModel({ userId, paymentMode });
    } else {
      account.paymentMode = paymentMode;
      if (paymentMode === 'invoicing' && !account.invoicingEligible) {
        throw new Error('User not eligible for monthly invoicing');
      }
    }
    return account.save();
  }

  async addPaymentMethod(userId: string, paymentMethod: { type: string; lastFour: string; expiry: string }): Promise<BillingAccount> {
    let account = await this.billingAccountModel.findOne({ userId }).exec();
    if (!account) {
      account = new this.billingAccountModel({ userId });
    }
    account.paymentMethod = paymentMethod;
    return account.save();
  }

  async updateThreshold(userId: string, threshold: number): Promise<BillingAccount> {
    const account = await this.billingAccountModel.findOne({ userId }).exec();
    if (!account) throw new NotFoundException('Billing account not found');
    account.paymentThreshold = threshold;
    return account.save();
  }

  async makeManualPayment(userId: string, amount: number): Promise<BillingAccount> {
    const account = await this.billingAccountModel.findOne({ userId }).exec();
    if (!account) throw new NotFoundException('Billing account not found');
    if (account.paymentMode !== 'manual') throw new Error('Manual payments only allowed in manual mode');
    account.balance += amount;
    return account.save();
  }

  async accrueCosts(userId: string, cost: number): Promise<BillingAccount> {
    const account = await this.billingAccountModel.findOne({ userId }).exec();
    if (!account) throw new NotFoundException('Billing account not found');

    account.accruedCosts += cost;

    if (account.paymentMode === 'automatic' && account.accruedCosts >= account.paymentThreshold) {
      account.accruedCosts = 0; // Simulate charge
    } else if (account.paymentMode === 'manual' && account.balance >= cost) {
      account.balance -= cost;
    } else if (account.paymentMode === 'manual' && account.balance < cost) {
      console.log('Insufficient balance; ads stopped');
    } else if (account.paymentMode === 'invoicing') {
      const now = new Date();
      if (!account.lastInvoiceDate || now.getMonth() !== account.lastInvoiceDate.getMonth()) {
        account.lastInvoiceDate = now;
        account.accruedCosts = 0; // Simulate invoicing
      }
    }

    return account.save();
  }
}