const API_URL = 'http://localhost:4000';

export interface ScalePort {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  vendorId?: string;
  productId?: string;
}

export interface ReadScaleRequest {
  port: string;
  baudRate?: number;
  timeoutMs?: number;
}

export interface ScaleReading {
  raw: string;
  value: number;
  unit: 'kg';
  grams: number;
  readAt: string;
}

export async function getScalePorts(): Promise<ScalePort[]> {
  const response = await fetch(`${API_URL}/scale/ports`);

  if (!response.ok) {
    throw new Error('No se pudieron listar los puertos seriales.');
  }

  const result = await response.json();

  return result.data;
}

export async function readScale(
  payload: ReadScaleRequest
): Promise<ScaleReading> {
  const response = await fetch(`${API_URL}/scale/read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('No se pudo leer el peso de la báscula.');
  }

  const result = await response.json();

  return result.data;
}