import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('api')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('stocks')
  getStocks() {
    return this.stockService.getAllStocks();
  }

  @Get('stocks/type/:type')
  getStocksByType(@Param('type') type: 'stock' | 'crypto') {
    return this.stockService.getStocksByType(type);
  }

  @Get('stocks/:symbol')
  getStock(@Param('symbol') symbol: string) {
    return this.stockService.getStock(symbol);
  }

  @Get('brokers')
  getBrokers() {
    return this.stockService.getAllBrokers();
  }

  @Post('brokers')
  addBroker(@Body() body: { name: string; initialBalance: number }) {
    return this.stockService.addBroker(body.name, body.initialBalance);
  }

  @Get('brokers/:id/profit')
  getBrokerProfit(@Param('id') id: string) {
    return this.stockService.getBrokerProfit(id);
  }

  @Post('simulation/start')
  startSimulation(@Body() body: { speed: number }) {
    const result = this.stockService.startSimulation(body.speed);
    console.log('Start simulation result:', result);
    return result;
  }

  @Post('simulation/stop')
  stopSimulation() {
    const result = this.stockService.stopSimulation();
    console.log('Stop simulation result:', result);
    return result;
  }

  @Get('simulation/status')
  getSimulationStatus() {
    return this.stockService.getSimulationStatus();
  }
}