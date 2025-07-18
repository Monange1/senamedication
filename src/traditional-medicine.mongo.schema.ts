import { Schema, model } from 'mongoose';

export const TraditionalMedicineSchema = new Schema({
  scientific_name: String,
  local_name: String,
  habit: String,
  habitat: String,
  parts_used: String,
  uses: String,
  amharic_name: String,
  amharic_uses: String,
});

export const TraditionalMedicineMongoModel = model('TraditionalMedicine', TraditionalMedicineSchema); 