import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserMongoModel } from './user.mongo.schema';

@Injectable()
export class UserService {
  async create(userData: any): Promise<any> {
    const existing = await UserMongoModel.findOne({ email: userData.email });
    if (existing) throw new ConflictException('Email already registered');
    const user = new UserMongoModel(userData);
    return user.save();
  }

  async findByEmail(email: string): Promise<any | null> {
    return UserMongoModel.findOne({ email });
  }

  async findByVerificationToken(token: string): Promise<any | null> {
    return UserMongoModel.findOne({ emailVerificationToken: token });
  }

  async update(id: string, updateData: any): Promise<any> {
    return UserMongoModel.findOneAndUpdate({ pgId: id }, updateData, { new: true });
  }

  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const token = uuidv4();
    await UserMongoModel.updateOne({ email }, {
      passwordResetToken: token,
      passwordResetTokenExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });
    return token;
  }

  async findByPasswordResetToken(token: string): Promise<any | null> {
    return UserMongoModel.findOne({ passwordResetToken: token });
  }

  async setPassword(id: string, newPassword: string): Promise<any> {
    const hashed = await bcrypt.hash(newPassword, 10);
    return UserMongoModel.findOneAndUpdate({ pgId: id }, {
      password: hashed,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
    }, { new: true });
  }

  // --- Added methods for build compatibility ---
  async findById(id: string): Promise<any | null> {
    // Try by pgId (from migration) or _id (native Mongo)
    return UserMongoModel.findOne({ $or: [{ pgId: id }, { _id: id }] });
  }

  async getAllUsers(): Promise<any[]> {
    return UserMongoModel.find();
  }

  async delete(id: string): Promise<any> {
    return UserMongoModel.deleteOne({ $or: [{ pgId: id }, { _id: id }] });
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    // Find user by passwordResetToken
    const user = await this.findByPasswordResetToken(token);
    if (!user) throw new NotFoundException('Invalid or expired reset token');
    return this.setPassword(user.pgId || user._id, newPassword);
  }
  // --- End added methods ---
} 