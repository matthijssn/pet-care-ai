import { Schema, model, InferSchemaType } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user' },
  // MFA fields
  mfaEnabled: { type: Boolean, default: false },
  // The verified base32 secret (stored only after verification)
  mfaSecret: { type: String },
  // A temporary secret used during setup before verification
  mfaTempSecret: { type: String },
  // Recovery codes (plain strings) - consider hashing for production
  mfaRecoveryCodes: { type: [String], default: [] }
});

type UserDoc = InferSchemaType<typeof userSchema>;
export const User = model<UserDoc>('User', userSchema);