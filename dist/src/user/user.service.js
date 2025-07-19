"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const user_mongo_schema_1 = require("./user.mongo.schema");
let UserService = class UserService {
    async create(userData) {
        const existing = await user_mongo_schema_1.UserMongoModel.findOne({ email: userData.email });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const user = new user_mongo_schema_1.UserMongoModel(userData);
        return user.save();
    }
    async findByEmail(email) {
        return user_mongo_schema_1.UserMongoModel.findOne({ email });
    }
    async findByVerificationToken(token) {
        return user_mongo_schema_1.UserMongoModel.findOne({ emailVerificationToken: token });
    }
    async update(id, updateData) {
        return user_mongo_schema_1.UserMongoModel.findOneAndUpdate({ pgId: id }, updateData, { new: true });
    }
    async generatePasswordResetToken(email) {
        const user = await this.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const token = (0, uuid_1.v4)();
        await user_mongo_schema_1.UserMongoModel.updateOne({ email }, {
            passwordResetToken: token,
            passwordResetTokenExpires: new Date(Date.now() + 60 * 60 * 1000),
        });
        return token;
    }
    async findByPasswordResetToken(token) {
        return user_mongo_schema_1.UserMongoModel.findOne({ passwordResetToken: token });
    }
    async setPassword(id, newPassword) {
        const hashed = await bcrypt.hash(newPassword, 10);
        return user_mongo_schema_1.UserMongoModel.findOneAndUpdate({ pgId: id }, {
            password: hashed,
            passwordResetToken: null,
            passwordResetTokenExpires: null,
        }, { new: true });
    }
    async findById(id) {
        return user_mongo_schema_1.UserMongoModel.findOne({ $or: [{ pgId: id }, { _id: id }] });
    }
    async getAllUsers() {
        return user_mongo_schema_1.UserMongoModel.find();
    }
    async delete(id) {
        return user_mongo_schema_1.UserMongoModel.deleteOne({ $or: [{ pgId: id }, { _id: id }] });
    }
    async resetPassword(token, newPassword) {
        const user = await this.findByPasswordResetToken(token);
        if (!user)
            throw new common_1.NotFoundException('Invalid or expired reset token');
        return this.setPassword(user.pgId || user._id, newPassword);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map