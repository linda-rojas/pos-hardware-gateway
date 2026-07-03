import Link from 'next/link';

const modules = [
  {
    title: 'Lector de códigos y QR',
    description:
      'Prueba la captura de códigos de barras y códigos QR desde un lector USB 2D o compatible.',
    href: '/barcode',
    status: 'Disponible',
  },
  {
    title: 'Impresora térmica',
    description:
      'Prueba impresión de tickets, recibos y comandos para impresora térmica.',
    href: '/printer',
    status: 'Disponible',
  },
  {
    title: 'Cajón monedero',
    description:
      'Prueba apertura del cajón mediante impresora o conexión directa.',
    href: '/cash-drawer',
    status: 'Disponible',
  },
  {
    title: 'Báscula USB',
    description:
      'Prueba lectura de peso desde báscula conectada por USB, serial o HID.',
    href: '/scale',
    status: 'Próximamente',
  },
];

export default function TesterHomePage() {
  return (
    <main className="container">
      <section className="hero">
        <h1>POS Hardware Tester</h1>

        <p>
          Panel local para probar los dispositivos físicos antes de integrarlos
          al sistema POS.
        </p>
      </section>

      <section className="module-grid">
        {modules.map((module) => (
          <Link key={module.href} href={module.href} className="module-card">
            <div>
              <h2>{module.title}</h2>
              <p>{module.description}</p>
            </div>

            <span
              className={
                module.status === 'Disponible'
                  ? 'module-status available'
                  : 'module-status pending'
              }
            >
              {module.status}
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}