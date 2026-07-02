import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { BarcodeScanEntity } from '../domain/barcode-scan.entity';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class BarcodeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private readonly logger = new Logger(BarcodeGateway.name);

    handleConnection(client: Socket) {
        this.logger.log(`Socket conectado: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Socket desconectado: ${client.id}`);
    }

    emitBarcodeScanned(scan: BarcodeScanEntity) {
        this.server.emit('barcode.scanned', scan);
    }
}