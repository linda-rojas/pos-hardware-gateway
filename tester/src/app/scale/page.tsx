import Link from 'next/link';
import { ScaleReadForm } from '../../features/scale/components/ScaleReadForm';

export default function ScaleTesterPage() {
    return (
        <main className="container">
            <Link href="/" className="back-link">
                ← Volver al panel
            </Link>

            <section className="hero">
                <h1>Tester de báscula USB</h1>

                <p>
                    Prueba local para leer el peso desde una báscula conectada por USB y
                    expuesta como puerto serial en Windows.
                </p>
            </section>

            <ScaleReadForm />
        </main>
    );
}