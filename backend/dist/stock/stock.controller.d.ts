import { StockService } from './stock.service';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    getStocks(): import("./stock.service").Stock[];
    getStocksByType(type: 'stock' | 'crypto'): import("./stock.service").Stock[];
    getStock(symbol: string): import("./stock.service").Stock;
    getBrokers(): import("./stock.service").Broker[];
    addBroker(body: {
        name: string;
        initialBalance: number;
    }): import("./stock.service").Broker;
    getBrokerProfit(id: string): {
        [symbol: string]: number;
    };
    startSimulation(body: {
        speed: number;
    }): {
        message: string;
        success: boolean;
    };
    stopSimulation(): {
        message: string;
        success: boolean;
    };
    getSimulationStatus(): {
        isRunning: boolean;
        speed: number;
    };
}
