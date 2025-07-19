"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MedicationReminderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationReminderService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const user_service_1 = require("./user/user.service");
const email_service_1 = require("./email/email.service");
let MedicationReminderService = MedicationReminderService_1 = class MedicationReminderService {
    constructor(userService, emailService) {
        this.userService = userService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(MedicationReminderService_1.name);
    }
    async handleReminders() {
        this.logger.log('Medication reminder cron job running at ' + new Date().toISOString());
        try {
            const users = await this.userService.getAllUsers();
            this.logger.log(`Found ${users.length} users`);
            const now = new Date();
            for (const user of users) {
                if (!user.email) {
                    this.logger.warn(`User ${user.id} has no email, skipping`);
                    continue;
                }
                if (!user.medications) {
                    this.logger.log(`User ${user.email} has no medications, skipping`);
                    continue;
                }
                for (const med of user.medications) {
                    if (!med.times || !Array.isArray(med.times)) {
                        this.logger.log(`Medication ${med.name} for ${user.email} has no times, skipping`);
                        continue;
                    }
                    for (const t of med.times) {
                        const [h, m] = t.split(':').map(Number);
                        if (isNaN(h) || isNaN(m)) {
                            this.logger.warn(`Invalid time ${t} for ${med.name} (${user.email}), skipping`);
                            continue;
                        }
                        const eatNow = new Date(now);
                        eatNow.setUTCHours(h - 3, m, 0, 0);
                        const diff = eatNow.getTime() - now.getTime();
                        this.logger.log(`Checking med ${med.name} for ${user.email} at ${t} (diff ${diff} ms)`);
                        if (Math.abs(diff) < 60000) {
                            try {
                                await this.emailService.sendReminderEmail(user.email, `Medication Reminder: ${med.name}`, `It's time to take your medication: <b>${med.name}</b> (Dosage: ${med.dosage || ''}) at ${t} (EAT).`);
                                this.logger.log(`Sent reminder to ${user.email} for ${med.name} at ${t}`);
                            }
                            catch (err) {
                                this.logger.error(`Failed to send reminder to ${user.email} for ${med.name} at ${t}`, err);
                            }
                        }
                    }
                }
            }
        }
        catch (err) {
            this.logger.error('Error in medication reminder cron job', err);
        }
    }
};
exports.MedicationReminderService = MedicationReminderService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicationReminderService.prototype, "handleReminders", null);
exports.MedicationReminderService = MedicationReminderService = MedicationReminderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        email_service_1.EmailService])
], MedicationReminderService);
//# sourceMappingURL=medication-reminder.service.js.map