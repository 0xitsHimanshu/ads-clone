// @src/billing/billing.controller.ts
import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';

@Controller('billing')
@UseGuards(AuthGuard('jwt'))
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('account')
  async getBillingAccount(@Req() req) {
    return this.billingService.getBillingAccount(req.user.userId);
  }

  @Put('payment-mode')
  async updatePaymentMode(@Req() req, @Body() body: { paymentMode: string }) {
    return this.billingService.updatePaymentMode(
      req.user.userId,
      body.paymentMode,
    );
  }

  @Post('payment-method')
  async addPaymentMethod(
    @Req() req,
    @Body() body: { type: string; lastFour: string; expiry: string },
  ) {
    return this.billingService.addPaymentMethod(req.user.userId, body);
  }

  @Put('threshold')
  async updateThreshold(@Req() req, @Body() body: { threshold: number }) {
    return this.billingService.updateThreshold(req.user.userId, body.threshold);
  }

  @Post('manual-payment')
  async makeManualPayment(@Req() req, @Body() body: { amount: number }) {
    return this.billingService.makeManualPayment(req.user.userId, body.amount);
  }

  // For testing cost accrual
  @Post('accrue-cost')
  async accrueCosts(@Req() req, @Body() body: { cost: number }) {
    return this.billingService.accrueCosts(req.user.userId, body.cost);
  }
}
