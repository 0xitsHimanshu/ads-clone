import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Ad extends Document {
  @Prop({ type: Types.ObjectId, ref: 'AdGroup', required: true })
  adGroupId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  targetUrl: string;

  @Prop({ required: true })
  maxCpc: number; // Maximum cost per click

  @Prop({ default: 0 })
  impressions: number;

  @Prop({ default: 0 })
  clicks: number;
}

export const AdSchema = SchemaFactory.createForClass(Ad);