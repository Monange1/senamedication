import { Controller, Get, Patch, Body, UseGuards, Request, Post, Param, Delete, ForbiddenException, Response, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response as ExpressResponse } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@Request() req) {
    // req.user is set by JwtStrategy
    return this.userService.findById(req.user.userId || req.user.id);
  }

  @Patch('me')
  async updateMe(@Request() req, @Body() body: any) {
    return this.userService.update(req.user.userId || req.user.id, body);
  }

  // --- Medications CRUD ---
  @Get('me/medications')
  async getMedications(@Request() req) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    return user.medications || [];
  }

  @Post('me/medications')
  async addMedication(@Request() req, @Body() med: any) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    const meds = user.medications || [];
    meds.push({ ...med, id: Date.now() });
    await this.userService.update(user.id, { medications: meds });
    return meds;
  }

  @Patch('me/medications/:medId')
  async updateMedication(@Request() req, @Body() med: any, @Param('medId') medId: string) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    const meds = (user.medications || []).map((m: any) => m.id == medId ? { ...m, ...med } : m);
    await this.userService.update(user.id, { medications: meds });
    return meds;
  }

  @Delete('me/medications/:medId')
  async deleteMedication(@Request() req, @Param('medId') medId: string) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    const meds = (user.medications || []).filter((m: any) => m.id != medId);
    await this.userService.update(user.id, { medications: meds });
    return meds;
  }

  // --- Tracked Conditions CRUD ---
  @Get('me/conditions')
  async getConditions(@Request() req) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    return user.trackedConditions || [];
  }

  @Post('me/conditions')
  async addCondition(@Request() req, @Body() cond: any) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    const conds = user.trackedConditions || [];
    const now = new Date().toISOString();
    conds.push({
      ...cond,
      id: Date.now(),
      firstCheckup: now,
      lastCheckup: now,
      checkupHistory: [],
    });
    await this.userService.update(user.id, { trackedConditions: conds });
    return conds;
  }

  // Add a checkup to a tracked condition
  @Post('me/conditions/:condId/checkup')
  async addConditionCheckup(@Request() req, @Param('condId') condId: string, @Body() checkup: any) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    const conds = user.trackedConditions || [];
    const idx = conds.findIndex((c: any) => c.id == condId);
    if (idx === -1) throw new Error('Condition not found');
    const now = new Date().toISOString();
    conds[idx].lastCheckup = now;
    if (!conds[idx].checkupHistory) conds[idx].checkupHistory = [];
    conds[idx].checkupHistory.push({ date: now, ...checkup });
    await this.userService.update(user.id, { trackedConditions: conds });
    return conds[idx];
  }

  @Patch('me/conditions/:condId')
  async updateCondition(@Request() req, @Body() cond: any, @Param('condId') condId: string) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    const conds = (user.trackedConditions || []).map((c: any) => c.id == condId ? { ...c, ...cond } : c);
    await this.userService.update(user.id, { trackedConditions: conds });
    return conds;
  }

  @Delete('me/conditions/:condId')
  async deleteCondition(@Request() req, @Param('condId') condId: string) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    const conds = (user.trackedConditions || []).filter((c: any) => c.id != condId);
    await this.userService.update(user.id, { trackedConditions: conds });
    return conds;
  }

  // --- Activity Log ---
  @Get('me/activity')
  async getActivity(@Request() req) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    return user.activityLog || [];
  }

  @Post('me/activity')
  async addActivity(@Request() req, @Body() activity: any) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    const log = user.activityLog || [];
    log.unshift({ ...activity, timestamp: new Date().toISOString() });
    await this.userService.update(user.id, { activityLog: log.slice(0, 50) });
    return log;
  }

  // Admin: Get all users
  @Get('/admin/users')
  async getAllUsers(@Request() req) {
    // Only allow admin
    const user = await this.userService.findById(req.user.userId || req.user.id);
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Admins only');
    }
    const users = await this.userService.getAllUsers();
    // Return only safe fields (remove isActive)
    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isEmailVerified: u.isEmailVerified,
    }));
  }

  // Admin: Export users as CSV
  @Get('/admin/users/export')
  async exportUsers(@Request() req, @Res() res: ExpressResponse) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    if (!user || user.role !== 'admin') throw new ForbiddenException('Admins only');
    const users = await this.userService.getAllUsers();
    const csv = [
      'id,name,email,role,isEmailVerified',
      ...users.map(u => `${u.id},${u.name},${u.email},${u.role},${u.isEmailVerified}`)
    ].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csv);
  }

  // Admin: Get audit log (from activityLog)
  @Get('/admin/audit-log')
  async getAuditLog(@Request() req) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    if (!user || user.role !== 'admin') throw new ForbiddenException('Admins only');
    // For demo: return all users' activityLog
    const users = await this.userService.getAllUsers();
    return users.map(u => ({ id: u.id, name: u.name, email: u.email, activityLog: u.activityLog || [] }));
  }

  // Admin: Edit any user
  @Patch('/admin/users/:id')
  async adminEditUser(@Request() req, @Param('id') id: string, @Body() body: any) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    if (!user || user.role !== 'admin') throw new ForbiddenException('Admins only');
    return this.userService.update(id, body);
  }

  // Admin: Delete any user
  @Delete('/admin/users/:id')
  async adminDeleteUser(@Request() req, @Param('id') id: string) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    if (!user || user.role !== 'admin') throw new ForbiddenException('Admins only');
    return this.userService.delete(id);
  }

  // Admin: Reset any user's password
  @Post('/admin/users/:id/reset-password')
  async adminResetPassword(@Request() req, @Param('id') id: string, @Body() body: { newPassword: string }) {
    const user = await this.userService.findById(req.user.userId || req.user.id);
    if (!user || user.role !== 'admin') throw new ForbiddenException('Admins only');
    return this.userService.update(id, { password: body.newPassword });
  }
} 