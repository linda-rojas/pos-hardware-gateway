const API_URL = 'http://localhost:4000';

export interface OpenCashDrawerRequest {
    printerName: string;
    pulseType?: 'default' | 'pin2' | 'pin5';
}

export interface OpenCashDrawerResponse {
    printerName: string;
    pulseType: string;
    openedAt: string;
}

export async function openCashDrawer(
    payload: OpenCashDrawerRequest
): Promise<OpenCashDrawerResponse> {
    const response = await fetch(`${API_URL}/cash-drawer/open`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('No se pudo abrir el cajón monedero.');
    }

    const result = await response.json();

    return result.data;
}