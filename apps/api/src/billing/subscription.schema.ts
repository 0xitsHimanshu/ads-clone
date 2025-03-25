import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Subscription extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  plan: string; // e.g., 'basic', 'pro'

  @Prop({ required: true })
  status: string; // e.g., 'active', 'canceled'

  @Prop({ required: true })
  nextBillingDate: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);