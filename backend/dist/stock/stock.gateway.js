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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const stock_service_1 = require("./stock.service");
let StockGateway = class StockGateway {
    constructor(stockService) {
        this.stockService = stockService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        const marketData = this.stockService.getCurrentMarketData();
        client.emit('marketUpdate', marketData);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleSubscribeToMarket(client) {
        const marketData = this.stockService.getCurrentMarketData();
        client.emit('marketUpdate', marketData);
    }
    handlePlaceOrder(client, data) {
        try {
            const trade = this.stockService.executeTrade(data.brokerId, data.symbol, data.type, data.quantity);
            const marketData = this.stockService.getCurrentMarketData();
            this.server.emit('marketUpdate', marketData);
            client.emit('orderExecuted', trade);
        }
        catch (error) {
            client.emit('orderError', { message: error.message });
        }
    }
    broadcastMarketUpdate() {
        const marketData = this.stockService.getCurrentMarketData();
        this.server.emit('marketUpdate', marketData);
    }
};
exports.StockGateway = StockGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], StockGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribeToMarket'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], StockGateway.prototype, "handleSubscribeToMarket", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('placeOrder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], StockGateway.prototype, "handlePlaceOrder", null);
exports.StockGateway = StockGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [stock_service_1.StockService])
], StockGateway);
//# sourceMappingURL=stock.gateway.js.map