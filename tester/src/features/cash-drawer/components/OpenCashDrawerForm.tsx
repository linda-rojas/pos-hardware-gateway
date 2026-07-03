'use client';

import { FormEvent, useState } from 'react';
import { openCashDrawer } from '../../../shared/api/cash-drawer-api';

export function OpenCashDrawerForm() {
    const [printerName, setPrinterName] = useState('POS80');
    const [pulseType, setPulseType] = useState<'default' | 'pin2' | 'pin5'>(
        'default'
    );
    const [isOpening, setIsOpening] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!printerName.trim()) {
            setError('Debes ingresar el nombre de la impresora.');
            return;
        }

        try {
            setIsOpening(true);
            setMessage(null);
            setError(null);

            await openCashDrawer({
                printerName: printerName.trim(),
                pulseType,
            });

            setMessage('Comando de apertura enviado correctamente.');
        } catch (err) {
            console.error(err);
            setError(
                'No se pudo abrir el cajón. Revisa que esté conectado a la impresora y que no tenga seguro.'
            );
        } finally {
            setIsOpening(false);
        }
    }

    return (
        <section className="card">
            <h2>Abrir cajón monedero</h2>

            <p className="description">
                Esta prueba envía un comando ESC/POS a la impresora térmica para abrir
                el cajón conectado al puerto DK.
            </p>

            <form onSubmit={handleSubmit} className="device-form">
                <label>
                    Nombre de impresora
                    <input
                        type="text"
                        value={printerName}
                        onChange={(event) => setPrinterName(event.target.value)}
                        placeholder="POS80"
                        disabled={isOpening}
                    />
                </label>

                <label>
                    Tipo de pulso
                    <select
                        value={pulseType}
                        onChange={(event) =>
                            setPulseType(event.target.value as 'default' | 'pin2' | 'pin5')
                        }
                        disabled={isOpening}
                    >
                        <option value="default">Default</option>
                        <option value="pin2">Pin 2</option>
                        <option value="pin5">Pin 5</option>
                    </select>
                </label>

                <button type="submit" disabled={isOpening}>
                    {isOpening ? 'Abriendo...' : 'Abrir cajón'}
                </button>
            </form>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error">{error}</p>}
        </section>
    );
}