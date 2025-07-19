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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getMe(req) {
        return this.userService.findById(req.user.userId || req.user.id);
    }
    async updateMe(req, body) {
        return this.userService.update(req.user.userId || req.user.id, body);
    }
    async getMedications(req) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        return user.medications || [];
    }
    async addMedication(req, med) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        const meds = user.medications || [];
        meds.push(Object.assign(Object.assign({}, med), { id: Date.now() }));
        await this.userService.update(user.id, { medications: meds });
        return meds;
    }
    async updateMedication(req, med, medId) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        const meds = (user.medications || []).map((m) => m.id == medId ? Object.assign(Object.assign({}, m), med) : m);
        await this.userService.update(user.id, { medications: meds });
        return meds;
    }
    async deleteMedication(req, medId) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        const meds = (user.medications || []).filter((m) => m.id != medId);
        await this.userService.update(user.id, { medications: meds });
        return meds;
    }
    async getConditions(req) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        return user.trackedConditions || [];
    }
    async addCondition(req, cond) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        const conds = user.trackedConditions || [];
        const now = new Date().toISOString();
        conds.push(Object.assign(Object.assign({}, cond), { id: Date.now(), firstCheckup: now, lastCheckup: now, checkupHistory: [] }));
        await this.userService.update(user.id, { trackedConditions: conds });
        return conds;
    }
    async addConditionCheckup(req, condId, checkup) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        const conds = user.trackedConditions || [];
        const idx = conds.findIndex((c) => c.id == condId);
        if (idx === -1)
            throw new Error('Condition not found');
        const now = new Date().toISOString();
        conds[idx].lastCheckup = now;
        if (!conds[idx].checkupHistory)
            conds[idx].checkupHistory = [];
        conds[idx].checkupHistory.push(Object.assign({ date: now }, checkup));
        await this.userService.update(user.id, { trackedConditions: conds });
        return conds[idx];
    }
    async updateCondition(req, cond, condId) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        const conds = (user.trackedConditions || []).map((c) => c.id == condId ? Object.assign(Object.assign({}, c), cond) : c);
        await this.userService.update(user.id, { trackedConditions: conds });
        return conds;
    }
    async deleteCondition(req, condId) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        const conds = (user.trackedConditions || []).filter((c) => c.id != condId);
        await this.userService.update(user.id, { trackedConditions: conds });
        return conds;
    }
    async getActivity(req) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        return user.activityLog || [];
    }
    async addActivity(req, activity) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        const log = user.activityLog || [];
        log.unshift(Object.assign(Object.assign({}, activity), { timestamp: new Date().toISOString() }));
        await this.userService.update(user.id, { activityLog: log.slice(0, 50) });
        return log;
    }
    async getAllUsers(req) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        if (!user || user.role !== 'admin') {
            throw new common_1.ForbiddenException('Admins only');
        }
        const users = await this.userService.getAllUsers();
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            isEmailVerified: u.isEmailVerified,
        }));
    }
    async exportUsers(req, res) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        if (!user || user.role !== 'admin')
            throw new common_1.ForbiddenException('Admins only');
        const users = await this.userService.getAllUsers();
        const csv = [
            'id,name,email,role,isEmailVerified',
            ...users.map(u => `${u.id},${u.name},${u.email},${u.role},${u.isEmailVerified}`)
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
        res.send(csv);
    }
    async getAuditLog(req) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        if (!user || user.role !== 'admin')
            throw new common_1.ForbiddenException('Admins only');
        const users = await this.userService.getAllUsers();
        return users.map(u => ({ id: u.id, name: u.name, email: u.email, activityLog: u.activityLog || [] }));
    }
    async adminEditUser(req, id, body) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        if (!user || user.role !== 'admin')
            throw new common_1.ForbiddenException('Admins only');
        return this.userService.update(id, body);
    }
    async adminDeleteUser(req, id) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        if (!user || user.role !== 'admin')
            throw new common_1.ForbiddenException('Admins only');
        return this.userService.delete(id);
    }
    async adminResetPassword(req, id, body) {
        const user = await this.userService.findById(req.user.userId || req.user.id);
        if (!user || user.role !== 'admin')
            throw new common_1.ForbiddenException('Admins only');
        return this.userService.update(id, { password: body.newPassword });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('me/medications'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMedications", null);
__decorate([
    (0, common_1.Post)('me/medications'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addMedication", null);
__decorate([
    (0, common_1.Patch)('me/medications/:medId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('medId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMedication", null);
__decorate([
    (0, common_1.Delete)('me/medications/:medId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('medId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteMedication", null);
__decorate([
    (0, common_1.Get)('me/conditions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getConditions", null);
__decorate([
    (0, common_1.Post)('me/conditions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addCondition", null);
__decorate([
    (0, common_1.Post)('me/conditions/:condId/checkup'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('condId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addConditionCheckup", null);
__decorate([
    (0, common_1.Patch)('me/conditions/:condId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('condId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateCondition", null);
__decorate([
    (0, common_1.Delete)('me/conditions/:condId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('condId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteCondition", null);
__decorate([
    (0, common_1.Get)('me/activity'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getActivity", null);
__decorate([
    (0, common_1.Post)('me/activity'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addActivity", null);
__decorate([
    (0, common_1.Get)('/admin/users'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('/admin/users/export'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "exportUsers", null);
__decorate([
    (0, common_1.Get)('/admin/audit-log'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAuditLog", null);
__decorate([
    (0, common_1.Patch)('/admin/users/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminEditUser", null);
__decorate([
    (0, common_1.Delete)('/admin/users/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminDeleteUser", null);
__decorate([
    (0, common_1.Post)('/admin/users/:id/reset-password'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminResetPassword", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map