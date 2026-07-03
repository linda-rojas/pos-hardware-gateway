import Link from 'next/link';
import { OpenCashDrawerForm } from '../../features/cash-drawer/components/OpenCashDrawerForm';

export default function CashDrawerTesterPage() {
    return (
        <main className="container">
            <Link href="/" className="back-link">
                ← Volver al panel
            </Link>

            <section className="hero">
                <h1>Tester de cajón monedero</h1>

                <p>
                    Prueba local para abrir el cajón monedero conectado a la impresora
                    térmica POS.
                </p>
            </section>

            <OpenCashDrawerForm />
        </main>
    );
}