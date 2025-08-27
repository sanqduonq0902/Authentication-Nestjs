import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'User' })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ default: false })
  isVerify: boolean;
}

export const UserEntity = SchemaFactory.createForClass(User);

UserEntity.set('toJSON', {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});
