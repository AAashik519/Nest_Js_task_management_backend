import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

@Schema({ timestamps: true })


export class Organization {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Prop({ required: false, type: String })
  @IsString()
  description?: string;

  @Prop({ required: false, type: String })
  image!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @IsNotEmpty()
  ownerId!: string;
}


 export const OrganizationSchema = SchemaFactory.createForClass(Organization);