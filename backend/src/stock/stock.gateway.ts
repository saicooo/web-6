import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StockService } from './stock.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  },
})
export class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly stockService: StockService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Отправляем текущие данные при подключении
    const marketData = this.stockService.getCurrentMarketData();
    client.emit('marketUpdate', marketData);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToMarket')
  handleSubscribeToMarket(client: Socket) {
    const marketData = this.stockService.getCurrentMarketData();
    client.emit('marketUpdate', marketData);
  }

  @SubscribeMessage('placeOrder')
  handlePlaceOrder(client: Socket, data: {
    brokerId: string;
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
  }) {
    try {
      const trade = this.stockService.executeTrade(
        data.brokerId,
        data.symbol,
        data.type,
        data.quantity
      );
      
      // Отправляем обновление всем клиентам
      const marketData = this.stockService.getCurrentMarketData();
      this.server.emit('marketUpdate', marketData);
      
      // Отправляем подтверждение торгов
      client.emit('orderExecuted', trade);
      
    } catch (error) {
      client.emit('orderError', { message: error.message });
    }
  }

  // Новый метод для отправки обновлений рынка
  broadcastMarketUpdate() {
    const marketData = this.stockService.getCurrentMarketData();
    this.server.emit('marketUpdate', marketData);
  }
}