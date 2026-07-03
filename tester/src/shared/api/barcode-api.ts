const API_URL = 'http://localhost:4000';

export interface CreateBarcodeScanRequest {
    code: string;
    source?: string;
    deviceId?: string;
}

export interface BarcodeScan {
    id: string;
    code: string;
    source: string;
    deviceId: string;
    scannedAt: string;
}

export async function createBarcodeScan(
    payload: CreateBarcodeScanRequest
): Promise<BarcodeScan> {
    const response = await fetch(`${API_URL}/barcode/scans`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Error sending barcode scan');
    }

    const result = await response.json();

    return result.data;
}

export async function getBarcodeScans(): Promise<BarcodeScan[]> {
    const response = await fetch(`${API_URL}/barcode/scans`);

    if (!response.ok) {
        throw new Error('Error loading barcode scans');
    }

    const result = await response.json();

    return result.data;
}