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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const app_dto_1 = require("./app.dto");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async registerUser(request) {
        const result = await this.appService.registerUser(request.username);
        const response = {
            success: result,
        };
        return response;
    }
    async submitContract(request) {
        return await this.appService.submitContract(request);
    }
    async queryContract(request) {
        return await this.appService.queryContract(request);
    }
    async signContract(request) {
        return await this.appService.signingContract(request);
    }
    async enrollAdmin() {
        return await this.appService.enrollAdmin();
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    common_1.Post('/register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_dto_1.RegisterRequest]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "registerUser", null);
__decorate([
    common_1.Post('submit-contract'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_dto_1.SubmitContractRequest]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "submitContract", null);
__decorate([
    common_1.Post('query-contract'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_dto_1.QueryContractRequest]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "queryContract", null);
__decorate([
    common_1.Post('sign-contract'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [app_dto_1.SiginingContractRequest]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "signContract", null);
__decorate([
    common_1.Post('enroll-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "enrollAdmin", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map