// Entire file commented out to bypass build errors
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrugsController } from './drugs.controller';
import { DrugsService } from './drugs.service';
import { DrugSchema } from './drug.mongo.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Drug', schema: DrugSchema }])],
  controllers: [DrugsController],
  providers: [DrugsService],
  exports: [DrugsService],
})
export class DrugsModule {} 