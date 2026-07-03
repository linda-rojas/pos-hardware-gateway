'use client';

import { FormEvent, useRef, useState } from 'react';
import { createBarcodeScan } from '../../../shared/api/barcode-api';

interface BarcodeScannerInputProps {
    onScanCreated?: () => void;
}

export function BarcodeScannerInput({
    onScanCreated,
}: BarcodeScannerInputProps) {
    const [code, setCode] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const cleanCode = code.trim();

        if (!cleanCode) {
            return;
        }

        try {
            setIsSending(true);
            setError(null);

            await createBarcodeScan({
                code: cleanCode,
                source: 'tester-local',
                deviceId: 'barcode-scanner-001',
            });

            setCode('');
            onScanCreated?.();

            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        } catch (err) {
            console.error(err);
            setError('No se pudo enviar el código al backend.');
        } finally {
            setIsSending(false);
        }
    }

    return (
        <section className="card">
            <h2>Escanear código o QR</h2>

            <p className="description">
                Haz clic en el campo y escanea con el lector. Si el lector envía Enter,
                el código se enviará automáticamente.
            </p>

            <form onSubmit={handleSubmit} className="scan-form">
                <input
                    ref={inputRef}
                    type="text"
                    value={code}
                    autoFocus
                    placeholder="Escanea un código de barras o QR..."
                    onChange={(event) => setCode(event.target.value)}
                    disabled={isSending}
                />

                <button type="submit" disabled={isSending || !code.trim()}>
                    {isSending ? 'Enviando...' : 'Enviar'}
                </button>
            </form>

            {error && <p className="error">{error}</p>}
        </section>
    );
}