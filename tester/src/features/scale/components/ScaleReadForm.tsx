'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  getScalePorts,
  readScale,
  ScalePort,
  ScaleReading,
} from '../../../shared/api/scale-api';

export function ScaleReadForm() {
  const [ports, setPorts] = useState<ScalePort[]>([]);
  const [port, setPort] = useState('COM4');
  const [baudRate, setBaudRate] = useState(9600);
  const [timeoutMs, setTimeoutMs] = useState(2500);
  const [reading, setReading] = useState<ScaleReading | null>(null);
  const [isLoadingPorts, setIsLoadingPorts] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPorts() {
    try {
      setIsLoadingPorts(true);
      setError(null);

      const data = await getScalePorts();

      setPorts(data);

      if (data.length > 0 && !data.some((item) => item.path === port)) {
        setPort(data[0].path);
      }
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los puertos seriales.');
    } finally {
      setIsLoadingPorts(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!port.trim()) {
      setError('Debes seleccionar o ingresar un puerto.');
      return;
    }

    try {
      setIsReading(true);
      setError(null);

      const data = await readScale({
        port: port.trim(),
        baudRate,
        timeoutMs,
      });

      setReading(data);
    } catch (err) {
      console.error(err);
      setError(
        'No se pudo leer la báscula. Revisa que esté conectada y que el puerto no esté ocupado.'
      );
    } finally {
      setIsReading(false);
    }
  }

  useEffect(() => {
    loadPorts();
  }, []);

  return (
    <section className="card">
      <h2>Leer peso desde báscula</h2>

      <p className="description">
        Esta prueba lee el peso desde una báscula USB expuesta por Windows como
        puerto serial.
      </p>

      <form onSubmit={handleSubmit} className="device-form">
        <label>
          Puerto serial
          <select
            value={port}
            onChange={(event) => setPort(event.target.value)}
            disabled={isReading || isLoadingPorts}
          >
            {ports.length === 0 && <option value={port}>{port}</option>}

            {ports.map((item) => (
              <option key={item.path} value={item.path}>
                {item.path}
                {item.manufacturer ? ` - ${item.manufacturer}` : ''}
              </option>
            ))}
          </select>
        </label>

        <label>
          Baud rate
          <input
            type="number"
            value={baudRate}
            onChange={(event) => setBaudRate(Number(event.target.value))}
            disabled={isReading}
          />
        </label>

        <label>
          Tiempo de lectura ms
          <input
            type="number"
            value={timeoutMs}
            onChange={(event) => setTimeoutMs(Number(event.target.value))}
            disabled={isReading}
          />
        </label>

        <div className="button-row">
          <button type="button" onClick={loadPorts} disabled={isLoadingPorts}>
            {isLoadingPorts ? 'Buscando...' : 'Actualizar puertos'}
          </button>

          <button type="submit" disabled={isReading}>
            {isReading ? 'Leyendo...' : 'Leer peso'}
          </button>
        </div>
      </form>

      {reading && (
        <div className="result-box">
          <h3>Lectura actual</h3>

          <strong>{reading.value.toFixed(3)} kg</strong>

          <p>{reading.grams} g</p>

          <small>Raw: {reading.raw}</small>

          <small>{new Date(reading.readAt).toLocaleString()}</small>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}