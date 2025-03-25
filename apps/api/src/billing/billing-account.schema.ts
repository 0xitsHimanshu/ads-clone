// @src/billing/billing-account.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class BillingAccount extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ default: 'automatic', enum: ['automatic', 'manual', 'invoicing'] })
  paymentMode: string;

  @Prop({ default: 50 }) // Starting threshold in dollars
  paymentThreshold: number;

  @Prop({ default: 0 }) // Prepaid balance for manual payments
  balance: number;

  @Prop({ type: Object }) // Simplified payment method storage
  paymentMethod: {
    type: string; // e.g., 'credit_card', 'debit_card'
    lastFour: string;
    expiry: string;
  };

  @Prop({ default: false }) // Eligibility for monthly invoicing
  invoicingEligible: boolean;

  @Prop() // Last invoice date for invoicing mode
  lastInvoiceDate?: Date;

  @Prop({ default: 0 }) // Accumulated costs since last charge/invoice
  accruedCosts: number;
}

export const BillingAccountSchema = SchemaFactory.createForClass(BillingAccount);