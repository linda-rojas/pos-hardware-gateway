'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BarcodeScan } from '../../../shared/api/barcode-api';

const SOCKET_URL = 'http://localhost:4000';

export function useBarcodeSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastSocketScan, setLastSocketScan] = useState<BarcodeScan | null>(
        null
    );

    useEffect(() => {
        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket'],
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });

        socketInstance.on('barcode.scanned', (scan: BarcodeScan) => {
            setLastSocketScan(scan);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return {
        socket,
        isConnected,
        lastSocketScan,
    };
}