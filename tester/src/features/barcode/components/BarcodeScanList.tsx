'use client';

import { BarcodeScan } from '../../../shared/api/barcode-api';

interface BarcodeScanListProps {
    scans: BarcodeScan[];
}

export function BarcodeScanList({ scans }: BarcodeScanListProps) {
    return (
        <section className="card">
            <h2>Últimos códigos escaneados</h2>

            {scans.length === 0 ? (
                <p className="description">Todavía no hay códigos escaneados.</p>
            ) : (
                <div className="scan-list">
                    {scans.map((scan) => (
                        <article key={scan.id} className="scan-item">
                            <strong>{scan.code}</strong>

                            <small>
                                Dispositivo: {scan.deviceId} | Fuente: {scan.source}
                            </small>

                            <small>{new Date(scan.scannedAt).toLocaleString()}</small>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}