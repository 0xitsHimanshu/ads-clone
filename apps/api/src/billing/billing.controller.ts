import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';

@Controller('billing')
@UseGuards(AuthGuard('jwt'))
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('subscription')
  async getSubscription(@Req() req) {
    return this.billingService.getSubscription(req.user.userId);
  }

  @Put('subscription')
  async updateSubscription(@Req() req, @Body() body: { plan: string }) {
    return this.billingService.updateSubscription(req.user.userId, body.plan);
  }
}