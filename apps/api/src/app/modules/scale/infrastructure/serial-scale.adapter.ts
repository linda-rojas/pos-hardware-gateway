import { Injectable } from '@nestjs/common';
import { SerialPort } from 'serialport';

export interface ScaleReading {
    raw: string;
    value: number;
    unit: 'kg';
    readAt: string;
}

@Injectable()
export class SerialScaleAdapter {
    async listPorts() {
        return SerialPort.list();
    }

    readWeight(portPath: string, baudRate = 9600, timeoutMs = 2500): Promise<ScaleReading> {
        return new Promise((resolve, reject) => {
            const port = new SerialPort({
                path: portPath,
                baudRate,
                dataBits: 8,
                stopBits: 1,
                parity: 'none',
                autoOpen: false,
            });

            let buffer = '';
            let lastReading: ScaleReading | null = null;

            const timer = setTimeout(() => {
                cleanup();

                if (lastReading) {
                    resolve(lastReading);
                    return;
                }

                reject(new Error(`No se recibió lectura desde la báscula en ${timeoutMs}ms`));
            }, timeoutMs);

            const cleanup = () => {
                clearTimeout(timer);

                if (port.isOpen) {
                    port.close();
                }
            };

            port.open((error) => {
                if (error) {
                    clearTimeout(timer);
                    reject(new Error(`No se pudo abrir el puerto ${portPath}: ${error.message}`));
                    return;
                }

                port.on('data', (data) => {
                    buffer += data.toString();

                    const lines = buffer.split(/\r?\n/);
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        const parsed = this.parseWeightLine(line);

                        if (!parsed) {
                            continue;
                        }

                        lastReading = parsed;
                    }
                });

                port.on('error', (error) => {
                    cleanup();
                    reject(new Error(`Error leyendo el puerto ${portPath}: ${error.message}`));
                });
            });
        });
    }

    private parseWeightLine(line: string): ScaleReading | null {
        const cleanLine = line.trim();

        if (!cleanLine) {
            return null;
        }

        const match = cleanLine.match(/[-+]?\d+(\.\d+)?/);

        if (!match) {
            return null;
        }

        const value = Number(match[0]);

        if (Number.isNaN(value)) {
            return null;
        }

        return {
            raw: cleanLine,
            value,
            unit: 'kg',
            readAt: new Date().toISOString(),
        };
    }
}