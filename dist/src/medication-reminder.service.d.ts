import { UserService } from './user/user.service';
import { EmailService } from './email/email.service';
export declare class MedicationReminderService {
    private readonly userService;
    private readonly emailService;
    private readonly logger;
    constructor(userService: UserService, emailService: EmailService);
    handleReminders(): Promise<void>;
}
