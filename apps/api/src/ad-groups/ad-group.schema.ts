import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class AdGroup extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true })
  campaignId: string;

  @Prop({ required: true })
  name: string;

  @Prop([String])
  keywords: string[];
}

export const AdGroupSchema = SchemaFactory.createForClass(AdGroup);
