"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
let StockService = class StockService {
    constructor() {
        this.stocks = [
            {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                currentPrice: 151.89,
                type: 'stock',
                history: [
                    { date: '11/5/2021', price: 151.89 },
                    { date: '11/4/2021', price: 151.58 },
                    { date: '11/3/2021', price: 150.39 },
                    { date: '11/2/2021', price: 148.96 },
                    { date: '11/1/2021', price: 149.81 },
                ],
            },
            {
                symbol: 'MSFT',
                name: 'Microsoft Corporation',
                currentPrice: 336.06,
                type: 'stock',
                history: [
                    { date: '11/5/2021', price: 336.06 },
                    { date: '11/4/2021', price: 331.62 },
                    { date: '11/3/2021', price: 329.37 },
                    { date: '11/2/2021', price: 331.85 },
                    { date: '11/1/2021', price: 330.75 },
                ],
            },
            {
                symbol: 'GOOGL',
                name: 'Alphabet Inc.',
                currentPrice: 2756.32,
                type: 'stock',
                history: [
                    { date: '11/5/2021', price: 2756.32 },
                    { date: '11/4/2021', price: 2745.11 },
                    { date: '11/3/2021', price: 2720.56 },
                    { date: '11/2/2021', price: 2734.12 },
                    { date: '11/1/2021', price: 2718.45 },
                ],
            },
            {
                symbol: 'TSLA',
                name: 'Tesla Inc.',
                currentPrice: 1222.09,
                type: 'stock',
                history: [
                    { date: '11/5/2021', price: 1222.09 },
                    { date: '11/4/2021', price: 1213.86 },
                    { date: '11/3/2021', price: 1208.59 },
                    { date: '11/2/2021', price: 1215.41 },
                    { date: '11/1/2021', price: 1209.01 },
                ],
            },
            {
                symbol: 'AMZN',
                name: 'Amazon.com Inc.',
                currentPrice: 3475.00,
                type: 'stock',
                history: [
                    { date: '11/5/2021', price: 3475.00 },
                    { date: '11/4/2021', price: 3462.12 },
                    { date: '11/3/2021', price: 3451.23 },
                    { date: '11/2/2021', price: 3468.45 },
                    { date: '11/1/2021', price: 3459.67 },
                ],
            },
            {
                symbol: 'BTC',
                name: 'Bitcoin',
                currentPrice: 61500,
                type: 'crypto',
                history: [
                    { date: '11/5/2021', price: 61500 },
                    { date: '11/4/2021', price: 61250 },
                    { date: '11/3/2021', price: 60800 },
                    { date: '11/2/2021', price: 61000 },
                    { date: '11/1/2021', price: 60950 },
                ],
            },
            {
                symbol: 'ETH',
                name: 'Ethereum',
                currentPrice: 4500,
                type: 'crypto',
                history: [
                    { date: '11/5/2021', price: 4500 },
                    { date: '11/4/2021', price: 4480 },
                    { date: '11/3/2021', price: 4450 },
                    { date: '11/2/2021', price: 4470 },
                    { date: '11/1/2021', price: 4465 },
                ],
            },
            {
                symbol: 'ADA',
                name: 'Cardano',
                currentPrice: 2.10,
                type: 'crypto',
                history: [
                    { date: '11/5/2021', price: 2.10 },
                    { date: '11/4/2021', price: 2.08 },
                    { date: '11/3/2021', price: 2.05 },
                    { date: '11/2/2021', price: 2.07 },
                    { date: '11/1/2021', price: 2.06 },
                ],
            },
            {
                symbol: 'DOT',
                name: 'Polkadot',
                currentPrice: 45.60,
                type: 'crypto',
                history: [
                    { date: '11/5/2021', price: 45.60 },
                    { date: '11/4/2021', price: 45.20 },
                    { date: '11/3/2021', price: 44.80 },
                    { date: '11/2/2021', price: 45.10 },
                    { date: '11/1/2021', price: 45.00 },
                ],
            },
            {
                symbol: 'SOL',
                name: 'Solana',
                currentPrice: 240.75,
                type: 'crypto',
                history: [
                    { date: '11/5/2021', price: 240.75 },
                    { date: '11/4/2021', price: 238.50 },
                    { date: '11/3/2021', price: 235.80 },
                    { date: '11/2/2021', price: 237.90 },
                    { date: '11/1/2021', price: 236.45 },
                ],
            }
        ];
        this.brokers = [
            {
                id: '1',
                name: 'John Smith',
                balance: 100000,
                portfolio: { AAPL: 10, MSFT: 5, BTC: 0.5 },
            },
            {
                id: '2',
                name: 'Sarah Johnson',
                balance: 150000,
                portfolio: { AAPL: 5, ETH: 2 },
            },
        ];
        this.trades = [];
        this.currentDateIndex = 0;
        this.simulationSpeed = 1;
        this.isSimulationRunning = false;
    }
    getAllStocks() {
        return this.stocks;
    }
    getStocksByType(type) {
        return this.stocks.filter(stock => stock.type === type);
    }
    getStock(symbol) {
        return this.stocks.find(stock => stock.symbol === symbol);
    }
    getAllBrokers() {
        return this.brokers;
    }
    getBroker(id) {
        return this.brokers.find(broker => broker.id === id);
    }
    addBroker(name, initialBalance) {
        const newBroker = {
            id: Date.now().toString(),
            name,
            balance: initialBalance,
            portfolio: {},
        };
        this.brokers.push(newBroker);
        return newBroker;
    }
    executeTrade(brokerId, symbol, type, quantity) {
        const broker = this.getBroker(brokerId);
        const stock = this.getStock(symbol);
        if (!broker || !stock) {
            throw new Error('Broker or stock not found');
        }
        const totalCost = stock.currentPrice * quantity;
        if (type === 'buy') {
            if (broker.balance < totalCost) {
                throw new Error('Insufficient funds');
            }
            broker.balance -= totalCost;
            broker.portfolio[symbol] = (broker.portfolio[symbol] || 0) + quantity;
        }
        else {
            if (!broker.portfolio[symbol] || broker.portfolio[symbol] < quantity) {
                throw new Error('Insufficient shares for sale');
            }
            broker.balance += totalCost;
            broker.portfolio[symbol] -= quantity;
            if (broker.portfolio[symbol] === 0) {
                delete broker.portfolio[symbol];
            }
        }
        const trade = {
            brokerId,
            symbol,
            type,
            quantity,
            price: stock.currentPrice,
            timestamp: new Date(),
        };
        this.trades.push(trade);
        return trade;
    }
    startSimulation(speed) {
        if (this.isSimulationRunning) {
            return { message: 'Simulation is already running', success: false };
        }
        this.simulationSpeed = speed;
        this.isSimulationRunning = true;
        console.log(`Starting simulation with speed: ${speed} seconds`);
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }
        this.simulationInterval = setInterval(() => {
            this.updateStockPrices();
        }, this.simulationSpeed * 1000);
        return { message: 'Simulation started successfully', success: true };
    }
    stopSimulation() {
        if (!this.isSimulationRunning) {
            return { message: 'Simulation is not running', success: false };
        }
        console.log('Stopping simulation');
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
        this.isSimulationRunning = false;
        return { message: 'Simulation stopped successfully', success: true };
    }
    getSimulationStatus() {
        return {
            isRunning: this.isSimulationRunning,
            speed: this.simulationSpeed,
        };
    }
    updateStockPrices() {
        this.currentDateIndex = (this.currentDateIndex + 1) % this.stocks[0].history.length;
        console.log(`Updating prices. Current date index: ${this.currentDateIndex}`);
        this.stocks.forEach(stock => {
            if (stock.history[this.currentDateIndex]) {
                const oldPrice = stock.currentPrice;
                stock.currentPrice = stock.history[this.currentDateIndex].price;
                console.log(`${stock.symbol}: ${oldPrice} -> ${stock.currentPrice}`);
            }
        });
    }
    getCurrentMarketData() {
        const currentDate = this.stocks[0].history[this.currentDateIndex]?.date || '11/5/2021';
        console.log(`Current date: ${currentDate}`);
        return {
            date: currentDate,
            stocks: this.stocks.map(stock => ({
                symbol: stock.symbol,
                price: stock.currentPrice,
                name: stock.name,
                type: stock.type,
            })),
        };
    }
    getBrokerProfit(brokerId) {
        const broker = this.getBroker(brokerId);
        const profit = {};
        Object.keys(broker.portfolio).forEach(symbol => {
            const stock = this.getStock(symbol);
            const currentValue = stock.currentPrice * broker.portfolio[symbol];
            const averageBuyPrice = stock.currentPrice * 0.9;
            const invested = averageBuyPrice * broker.portfolio[symbol];
            profit[symbol] = currentValue - invested;
        });
        return profit;
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)()
], StockService);
//# sourceMappingURL=stock.service.js.map