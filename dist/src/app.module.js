"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const drugs_module_1 = require("./drugs/drugs.module");
const schedule_1 = require("@nestjs/schedule");
const medication_reminder_service_1 = require("./medication-reminder.service");
const email_module_1 = require("./email/email.module");
const traditional_medicine_controller_1 = require("./traditional-medicine.controller");
const traditional_medicine_ai_controller_1 = require("./traditional-medicine-ai.controller");
const hospitals_controller_1 = require("./hospitals.controller");
const mongoose_1 = require("@nestjs/mongoose");
const root_controller_1 = require("./root.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            drugs_module_1.DrugsModule,
            email_module_1.EmailModule,
        ],
        providers: [medication_reminder_service_1.MedicationReminderService],
        controllers: [traditional_medicine_controller_1.TraditionalMedicineController, traditional_medicine_ai_controller_1.TraditionalMedicineAiController, hospitals_controller_1.HospitalsController, root_controller_1.RootController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map