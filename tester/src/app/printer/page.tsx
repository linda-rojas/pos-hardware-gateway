import { PrintTestForm } from '@/features/printer/components/PrintTestForm';
import Link from 'next/link';

export default function PrinterTesterPage() {
    return (
        <main className="container">
            <Link href="/" className="back-link">
                ← Volver al panel
            </Link>

            <section className="card">
                <h1>Tester de impresora térmica</h1>

                <p>
                    Prueba local para imprimir tickets desde el backend hacia la impresora
                    térmica instalada en Windows.
                </p>
            </section>

            <PrintTestForm />
        </main>
    );
}