import Link from 'next/link';

export default function ScaleTesterPage() {
    return (
        <main className="container">
            <Link href="/" className="back-link">
                ← Volver al panel
            </Link>

            <section className="card">
                <h1>Tester de báscula USB</h1>

                <p className="description">
                    Este módulo se implementará después. Aquí probaremos lectura de peso
                    desde báscula USB, serial o HID.
                </p>
            </section>
        </main>
    );
}