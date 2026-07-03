import Link from 'next/link';

export default function PrinterTesterPage() {
    return (
        <main className="container">
            <Link href="/" className="back-link">
                ← Volver al panel
            </Link>

            <section className="card">
                <h1>Tester de impresora térmica</h1>

                <p className="description">
                    Este módulo se implementará después del lector de código de barras.
                    Aquí probaremos impresión de tickets, recibos, cortes de papel y
                    comandos ESC/POS.
                </p>
            </section>
        </main>
    );
}