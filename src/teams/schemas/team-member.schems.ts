
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class TeamMember {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team' })
  teamId!: string;

  @Prop({ enum: ['admin', 'member'], default: 'member' })
  role!: string;
}


export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember)