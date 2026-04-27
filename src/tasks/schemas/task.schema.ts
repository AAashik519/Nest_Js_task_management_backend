import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TaskStatus } from 'src/utils/EmunsData';

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop()
  image!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  assignTo!: string;

  @Prop({ required: true })
  deadline!: Date;

  @Prop({
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @Prop()
  userDescription!: string;

  @Prop()
  userImage!: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
