import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StockController } from './stock/stock.controller';
import { StockService } from './stock/stock.service';
import { StockGateway } from './stock/stock.gateway';

@Module({
  imports: [
    EventEmitterModule.forRoot()
  ],
  controllers: [StockController],
  providers: [StockService, StockGateway],
})
export class AppModule {}