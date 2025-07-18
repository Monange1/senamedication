import { Controller, Get } from '@nestjs/common';
import { TraditionalMedicineMongoModel } from './traditional-medicine.mongo.schema';

@Controller('traditional-medicines')
export class TraditionalMedicineController {
  @Get()
  async getAll() {
    return TraditionalMedicineMongoModel.find();
  }
} 