export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    isEmailVerified: boolean;
    emailVerificationToken: string;
    emailVerificationTokenExpires: Date;
    passwordResetToken: string;
    passwordResetTokenExpires: Date;
    createdAt: Date;
    updatedAt: Date;
}
