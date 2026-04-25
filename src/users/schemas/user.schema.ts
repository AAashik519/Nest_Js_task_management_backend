import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ unique: true })
  email!: string;

  @Prop()
  password!: string;

  @Prop({ default: 'user' })
  role!: string;

  @Prop()
  name!: string;

  @Prop()
  number!: string;

  @Prop()
  image!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
