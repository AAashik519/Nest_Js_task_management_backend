import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true })
  teamId!: Types.ObjectId;

  @Prop({ enum: ['admin', 'member'], default: 'member' })
  role!: string;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);