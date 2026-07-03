const API_URL = 'http://localhost:4000';

export interface PrintTestRequest {
    printerName: string;
    title?: string;
}

export interface PrintTestResponse {
    printerName: string;
    printedAt: string;
}

export async function printTestTicket(
    payload: PrintTestRequest
): Promise<PrintTestResponse> {
    const response = await fetch(`${API_URL}/printer/print-test`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('No se pudo imprimir el ticket de prueba.');
    }

    const result = await response.json();

    return result.data;
}