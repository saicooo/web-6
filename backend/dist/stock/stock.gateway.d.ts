import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StockService } from './stock.service';
export declare class StockGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly stockService;
    server: Server;
    constructor(stockService: StockService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribeToMarket(client: Socket): void;
    handlePlaceOrder(client: Socket, data: {
        brokerId: string;
        symbol: string;
        type: 'buy' | 'sell';
        quantity: number;
    }): void;
    broadcastMarketUpdate(): void;
}
