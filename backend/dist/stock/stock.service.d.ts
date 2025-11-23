export interface Stock {
    symbol: string;
    name: string;
    currentPrice: number;
    history: {
        date: string;
        price: number;
    }[];
    type: 'stock' | 'crypto';
}
export interface Broker {
    id: string;
    name: string;
    balance: number;
    portfolio: {
        [symbol: string]: number;
    };
}
export interface Trade {
    brokerId: string;
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
    price: number;
    timestamp: Date;
}
export declare class StockService {
    private stocks;
    private brokers;
    private trades;
    private currentDateIndex;
    private simulationSpeed;
    private simulationInterval;
    private isSimulationRunning;
    getAllStocks(): Stock[];
    getStocksByType(type: 'stock' | 'crypto'): Stock[];
    getStock(symbol: string): Stock;
    getAllBrokers(): Broker[];
    getBroker(id: string): Broker;
    addBroker(name: string, initialBalance: number): Broker;
    executeTrade(brokerId: string, symbol: string, type: 'buy' | 'sell', quantity: number): Trade;
    startSimulation(speed: number): {
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
    private updateStockPrices;
    getCurrentMarketData(): {
        date: string;
        stocks: {
            symbol: string;
            price: number;
            name: string;
            type: "stock" | "crypto";
        }[];
    };
    getBrokerProfit(brokerId: string): {
        [symbol: string]: number;
    };
}
