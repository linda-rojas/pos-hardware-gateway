import Link from 'next/link';

export default function CashDrawerTesterPage() {
    return (
        <main className="container">
            <Link href="/" className="back-link">
                ← Volver al panel
            </Link>

            <section className="card">
                <h1>Tester de cajón monedero</h1>

                <p className="description">
                    Este módulo se implementará más adelante. Aquí probaremos apertura del
                    cajón monedero desde el sistema local.
                </p>
            </section>
        </main>
    );
}