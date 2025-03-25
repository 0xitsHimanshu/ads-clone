import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { AdsModule } from 'src/ads/ads.module';
import { BillingAccount, BillingAccountSchema } from './billing-account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BillingAccount.name, schema: BillingAccountSchema },
    ]),
    AdsModule,
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
