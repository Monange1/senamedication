import { Injectable } from '@nestjs/common';
import { DrugMongoModel } from './drug.mongo.schema';

@Injectable()
export class DrugsService {
  async findAll(): Promise<any[]> {
    return DrugMongoModel.find();
  }

  async findByName(name: string): Promise<any | null> {
    return DrugMongoModel.findOne({ name });
  }

  // --- Stub methods for build compatibility ---
  async searchOpenFdaDrugsByLetter(startsWith: string, tablets: boolean): Promise<any[]> {
    return [];
  }

  async searchOpenFdaDrugsByName(query: string): Promise<any[]> {
    return [];
  }

  async getDrugDetailByName(name: string): Promise<any> {
    return { name, description: null };
  }

  async searchDailyMedDrugsByName(query: string): Promise<any[]> {
    return [];
  }

  async searchRxImage({ imprint, color, shape }: { imprint: string; color?: string; shape?: string }): Promise<any> {
    return { results: [] };
  }

  async searchRxNavDrugsByName(query: string): Promise<any[]> {
    return [];
  }

  async searchDrugsDotComByName(query: string): Promise<any[]> {
    return [];
  }
  // --- End stub methods ---
} 