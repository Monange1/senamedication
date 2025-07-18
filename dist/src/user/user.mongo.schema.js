"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMongoModel = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    phone: String,
    age: Number,
    gender: String,
    dateOfBirth: Date,
    profilePicture: String,
    address: String,
    emergencyContactName: String,
    emergencyContactPhone: String,
    bloodType: String,
    allergies: String,
    chronicConditions: String,
    currentMedications: String,
    medicalHistory: String,
    preferredLanguage: String,
    occupation: String,
    onboardingComplete: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    subscriptionPlan: String,
    medications: { type: Array, default: [] },
    trackedConditions: { type: Array, default: [] },
    activityLog: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.UserMongoModel = (0, mongoose_1.model)('User', exports.UserSchema);
//# sourceMappingURL=user.mongo.schema.js.map