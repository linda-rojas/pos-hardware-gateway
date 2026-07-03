'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BarcodeScannerInput } from '../../features/barcode/components/BarcodeScannerInput';
import { BarcodeScanList } from '../../features/barcode/components/BarcodeScanList';
import { useBarcodeSocket } from '../../features/barcode/hooks/useBarcodeSocket';
import {
    BarcodeScan,
    getBarcodeScans,
} from '../../shared/api/barcode-api';

export default function BarcodeTesterPage() {
    const [scans, setScans] = useState<BarcodeScan[]>([]);
    const { isConnected, lastSocketScan } = useBarcodeSocket();

    async function loadScans() {
        try {
            const data = await getBarcodeScans();
            setScans(data);
        } catch (error) {
            console.error('Error loading scans', error);
        }
    }

    useEffect(() => {
        loadScans();
    }, []);

    useEffect(() => {
        if (!lastSocketScan) {
            return;
        }

        setScans((currentScans) => {
            const alreadyExists = currentScans.some(
                (scan) => scan.id === lastSocketScan.id
            );

            if (alreadyExists) {
                return currentScans;
            }

            return [lastSocketScan, ...currentScans].slice(0, 50);
        });
    }, [lastSocketScan]);

    return (
        <main className="container">
            <Link href="/" className="back-link">
                ← Volver al panel
            </Link>

            <section className="hero">
                <h1>Tester de lector de código de barras</h1>

                <p>
                    Prueba local para capturar códigos desde un lector USB antes de
                    integrarlo al sistema POS.
                </p>

                <div className={isConnected ? 'status online' : 'status offline'}>
                    Socket: {isConnected ? 'Conectado' : 'Desconectado'}
                </div>
            </section>

            <BarcodeScannerInput onScanCreated={loadScans} />

            <BarcodeScanList scans={scans} />
        </main>
    );
}