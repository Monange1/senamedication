import { Schema, model } from 'mongoose';

export const DrugSchema = new Schema({
  name: { type: String, required: true, index: true },
  lastFetched: { type: Date, default: Date.now },
});

export const DrugMongoModel = model('Drug', DrugSchema); 