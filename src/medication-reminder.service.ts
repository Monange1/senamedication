import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from './user/user.service';
import { EmailService } from './email/email.service';

@Injectable()
export class MedicationReminderService {
  private readonly logger = new Logger(MedicationReminderService.name);

  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminders() {
    this.logger.log('Medication reminder cron job running at ' + new Date().toISOString());
    try {
      const users = await this.userService.getAllUsers();
      this.logger.log(`Found ${users.length} users`);
      const now = new Date();
      for (const user of users) {
        if (!user.email) { this.logger.warn(`User ${user.id} has no email, skipping`); continue; }
        if (!user.medications) { this.logger.log(`User ${user.email} has no medications, skipping`); continue; }
        for (const med of user.medications) {
          if (!med.times || !Array.isArray(med.times)) { this.logger.log(`Medication ${med.name} for ${user.email} has no times, skipping`); continue; }
          for (const t of med.times) {
            const [h, m] = t.split(':').map(Number);
            if (isNaN(h) || isNaN(m)) { this.logger.warn(`Invalid time ${t} for ${med.name} (${user.email}), skipping`); continue; }
            const eatNow = new Date(now);
            eatNow.setUTCHours(h - 3, m, 0, 0); // Convert EAT to UTC
            const diff = eatNow.getTime() - now.getTime();
            this.logger.log(`Checking med ${med.name} for ${user.email} at ${t} (diff ${diff} ms)`);
            if (Math.abs(diff) < 60000) {
              try {
                await this.emailService.sendReminderEmail(
                  user.email,
                  `Medication Reminder: ${med.name}`,
                  `It's time to take your medication: <b>${med.name}</b> (Dosage: ${med.dosage || ''}) at ${t} (EAT).`
                );
                this.logger.log(`Sent reminder to ${user.email} for ${med.name} at ${t}`);
              } catch (err) {
                this.logger.error(`Failed to send reminder to ${user.email} for ${med.name} at ${t}`, err);
              }
            }
          }
        }
      }
    } catch (err) {
      this.logger.error('Error in medication reminder cron job', err);
    }
  }
} 