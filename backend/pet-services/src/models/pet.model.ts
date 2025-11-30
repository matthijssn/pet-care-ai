import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  name: { type: String, required: true },
  species: { 
    type: String, 
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Guinea Pig', 'other'],
    lowercase: true
  },
  breed: { type: String },
  birthday: { type: String },
  weightKg: { type: Number },
  color: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Pet = mongoose.model('Pet', petSchema);
