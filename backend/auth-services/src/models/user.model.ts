import { Schema, model, InferSchemaType } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user' }
});

type UserDoc = InferSchemaType<typeof userSchema>;
export const User = model<UserDoc>('User', userSchema);