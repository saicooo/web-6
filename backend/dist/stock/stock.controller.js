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
exports.StockController = void 0;
const common_1 = require("@nestjs/common");
const stock_service_1 = require("./stock.service");
let StockController = class StockController {
    constructor(stockService) {
        this.stockService = stockService;
    }
    getStocks() {
        return this.stockService.getAllStocks();
    }
    getStocksByType(type) {
        return this.stockService.getStocksByType(type);
    }
    getStock(symbol) {
        return this.stockService.getStock(symbol);
    }
    getBrokers() {
        return this.stockService.getAllBrokers();
    }
    addBroker(body) {
        return this.stockService.addBroker(body.name, body.initialBalance);
    }
    getBrokerProfit(id) {
        return this.stockService.getBrokerProfit(id);
    }
    startSimulation(body) {
        const result = this.stockService.startSimulation(body.speed);
        console.log('Start simulation result:', result);
        return result;
    }
    stopSimulation() {
        const result = this.stockService.stopSimulation();
        console.log('Stop simulation result:', result);
        return result;
    }
    getSimulationStatus() {
        return this.stockService.getSimulationStatus();
    }
};
exports.StockController = StockController;
__decorate([
    (0, common_1.Get)('stocks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getStocks", null);
__decorate([
    (0, common_1.Get)('stocks/type/:type'),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getStocksByType", null);
__decorate([
    (0, common_1.Get)('stocks/:symbol'),
    __param(0, (0, common_1.Param)('symbol')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getStock", null);
__decorate([
    (0, common_1.Get)('brokers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getBrokers", null);
__decorate([
    (0, common_1.Post)('brokers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "addBroker", null);
__decorate([
    (0, common_1.Get)('brokers/:id/profit'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getBrokerProfit", null);
__decorate([
    (0, common_1.Post)('simulation/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "startSimulation", null);
__decorate([
    (0, common_1.Post)('simulation/stop'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "stopSimulation", null);
__decorate([
    (0, common_1.Get)('simulation/status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getSimulationStatus", null);
exports.StockController = StockController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [stock_service_1.StockService])
], StockController);
//# sourceMappingURL=stock.controller.js.map