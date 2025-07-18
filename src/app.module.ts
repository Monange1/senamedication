import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DrugsModule } from './drugs/drugs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MedicationReminderService } from './medication-reminder.service';
import { EmailModule } from './email/email.module';
import { TraditionalMedicineController } from './traditional-medicine.controller';
import { TraditionalMedicineAiController } from './traditional-medicine-ai.controller';
import { HospitalsController } from './hospitals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RootController } from './root.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://mkmonange:aLR25U1hZFeBYS42@cluster0.l1888jm.mongodb.net/senamedb?retryWrites=true&w=majority'),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    DrugsModule,
    EmailModule,
  ],
  providers: [MedicationReminderService],
  controllers: [TraditionalMedicineController, TraditionalMedicineAiController, HospitalsController, RootController],
})
export class AppModule {} 