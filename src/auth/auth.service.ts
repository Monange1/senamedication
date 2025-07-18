import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(body: any) {
    const { name, email, password } = body;
    const existing = await this.userService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpires: verificationExpires,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.emailService.sendVerificationEmail(email, verificationToken);
    return { message: 'Registered successfully. Please check your email to verify your account.' };
  }

  async checkName(name: string) {
    // TODO: Implement name check logic
    return { available: true };
  }

  async checkEmail(email: string) {
    // TODO: Implement email check logic
    return { available: true };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userService.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }
    if (user.isEmailVerified) {
      return { message: 'Email already verified' };
    }
    if (user.emailVerificationTokenExpires && user.emailVerificationTokenExpires < new Date()) {
      throw new BadRequestException('Verification token expired');
    }
    await this.userService.update(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    });
    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // For security, do not reveal if user exists
      return { message: 'If that email is registered, a reset link has been sent.' };
    }
    const token = await this.userService.generatePasswordResetToken(email);
    await this.emailService.sendPasswordResetEmail(email, token);
    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    await this.userService.resetPassword(token, newPassword);
    return { message: 'Password has been reset successfully.' };
  }
} 