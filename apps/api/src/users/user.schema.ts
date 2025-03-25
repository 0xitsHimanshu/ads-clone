import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  company: string;

  @Prop()
  profilePicture: string;

  @Prop({ default: 'en' })
  language: string;

  @Prop({ default: 'UTC' })
  timezone: string;

  @Prop({ type: Object, default: { email: true, push: false } })
  notifications: { email: boolean; push: boolean };
}

export const UserSchema = SchemaFactory.createForClass(User);