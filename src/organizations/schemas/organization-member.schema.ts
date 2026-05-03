import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { OrgRole } from 'src/utils/EmunsData';

export type OrganizationMemberDocument = OrganizationMember & Document;

@Schema({ timestamps: true })
export class OrganizationMember {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationId!: Types.ObjectId;

  @Prop({ type: String, enum: OrgRole, default: OrgRole.MEMBER })
  role!: OrgRole;
}



export const OrganizationMemberSchema = SchemaFactory.createForClass(OrganizationMember);
