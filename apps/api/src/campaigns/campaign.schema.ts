// @src/campaigns/campaign.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Campaign extends Document {
  // The name of the campaign
  @Prop({ required: true })
  name: string;

  // The start date of the campaign
  @Prop({ required: true })
  startDate: Date;

  // The end date of the campaign
  @Prop({ required: true })
  endDate: Date;

  // The budget allocated for the campaign
  @Prop({ required: true })
  budget: number;

  // The status of the campaign, e.g., 'active', 'paused', 'completed'
  @Prop({ default: 'active' })
  status: string;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
