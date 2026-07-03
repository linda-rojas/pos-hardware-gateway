'use client';

import { FormEvent, useState } from 'react';
import { printTestTicket } from '../../../shared/api/printer-api';

export function PrintTestForm() {
    const [printerName, setPrinterName] = useState('POS80');
    const [title, setTitle] = useState('PRUEBA POS');
    const [isPrinting, setIsPrinting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!printerName.trim()) {
            setError('Debes ingresar el nombre de la impresora.');
            return;
        }

        try {
            setIsPrinting(true);
            setMessage(null);
            setError(null);

            await printTestTicket({
                printerName: printerName.trim(),
                title: title.trim() || 'PRUEBA POS',
            });

            setMessage('Ticket de prueba enviado correctamente.');
        } catch (err) {
            console.error(err);
            setError('No se pudo imprimir. Revisa que la impresora esté encendida y sin errores.');
        } finally {
            setIsPrinting(false);
        }
    }

    return (
        <section className="card">
            <h2>Imprimir ticket de prueba</h2>

            <p className="description">
                Esta prueba envía un ticket básico a la cola de impresión de Windows.
            </p>

            <form onSubmit={handleSubmit} className="printer-form">
                <label>
                    Nombre de impresora
                    <input
                        type="text"
                        value={printerName}
                        onChange={(event) => setPrinterName(event.target.value)}
                        placeholder="POS80"
                        disabled={isPrinting}
                    />
                </label>

                <label>
                    Título del ticket
                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="PRUEBA POS"
                        disabled={isPrinting}
                    />
                </label>

                <button type="submit" disabled={isPrinting}>
                    {isPrinting ? 'Imprimiendo...' : 'Imprimir prueba'}
                </button>
            </form>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error">{error}</p>}
        </section>
    );
}