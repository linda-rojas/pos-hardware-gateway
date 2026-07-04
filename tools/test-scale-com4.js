const { SerialPort } = require('serialport');

const port = new SerialPort({
  path: 'COM4',
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  autoOpen: false,
});

let buffer = '';
let lastValue = null;

function parseWeightLine(line) {
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
  };
}

port.open((error) => {
  if (error) {
    console.error('No se pudo abrir COM4:', error.message);
    return;
  }

  console.log('Escuchando báscula en COM4...');
  console.log('Solo se mostrará cuando cambie el peso.');

  port.on('data', (data) => {
    buffer += data.toString();

    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || '';

    for (const line of lines) {
      const parsed = parseWeightLine(line);

      if (!parsed) {
        continue;
      }

      if (parsed.value === lastValue) {
        continue;
      }

      lastValue = parsed.value;

      console.log('LECTURA:', parsed);
    }
  });
});