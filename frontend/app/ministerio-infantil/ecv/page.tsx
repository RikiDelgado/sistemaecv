//frontend/app/page.tsx
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export default function Home() {
  return (
    <main className="bg-gradient-to-b from-sky-300 via-yellow-100 to-amber-200 min-h-screen text-gray-800">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-amber-900">
          Colonia Cristiana de Vacaciones 2026
        </h1>

        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          <strong>Aventuras en el Desierto</strong> – Villa Celina  
          <br />
          Una experiencia única donde los niños descubrirán el plan de Dios
          a través de juegos, historias bíblicas y actividades inolvidables.
        </p>

        <Link
          href="/inscripcion"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg transition"
        >
          👉 Inscribite acá
        </Link>
      </section>

      {/* INFO GENERAL */}
      <section className="bg-white/80 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">📅 Duración</h3>
            <p>7 días – del 18 al 24 de enero</p>
          </div>
          <div className="p-6 rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">👦👧 Edades</h3>
            <p>Niños de 4 a 12 años</p>
          </div>
          <div className="p-6 rounded-xl shadow">
            <h3 className="font-bold text-xl mb-2">👕 Incluye</h3>
            <p>Remera oficial para cada niño</p>
          </div>
        </div>
      </section>

      {/* APERTURA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Image
            src="/images/apertura.png"
            alt="Apertura Aventuras en el Desierto"
            width={600}
            height={400}
            className="rounded-xl shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4 text-amber-900">
              Apertura: Aventuras en el Desierto
            </h2>
              <p className="mb-4">
                Acompañados por <strong>el Guía</strong> (representando a Jesús),
                y los hermanos <strong>Theo y Nina</strong>, los niños vivirán un
                emocionante viaje por el desierto mientras descubren verdades bíblicas profundas.
              </p>
              <p>
                El escenario conecta el <strong>auto rojo</strong> (símbolo de sacrificio)
                con la <strong>tienda del Santuario</strong>, mostrando que todo apunta
                a Jesús y a su plan de salvación.
              </p>
              <p>
                Cada elemento visual ayuda a los niños a comprender cómo Dios guiaba
                a su pueblo y cómo esas historias siguen teniendo significado hoy.
              </p>
              <p>
                A través de dinámicas y relatos, los participantes aprenderán que
                Dios siempre cumple sus promesas y camina con nosotros.
              </p>
              <p>
                El desierto se convierte en un lugar de aprendizaje, confianza
                y dependencia total en Dios.
              </p>
              <p>
                Todo el recorrido refuerza que Jesús es el centro de la historia
                y la esperanza para todos.
              </p>
          </div>
        </div>
      </section>

      {/* TIENDAS */}
      <section className="bg-amber-100 py-20">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-amber-900">
          Tiendas de la Misión Santuario
        </h2>

        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              title: "Tienda Bíblica",
              img: "/images/tienda-biblica.png",
              desc: "Historias bíblicas que explican el plan de Dios.",
            },
            {
              title: "Tienda del Santuario",
              img: "/images/tienda-santuario.png",
              desc: "Los muebles del Santuario y su significado.",
            },
            {
              title: "Tienda de Manualidades",
              img: "/images/tienda-manualidades.png",
              desc: "Actividades creativas para aprender jugando.",
            },
            {
              title: "Tienda de los Juegos",
              img: "/images/tienda-juegos.png",
              desc: "Juegos dinámicos y recreativos.",
            },
            {
              title: "Tienda Culinaria",
              img: "/images/tienda-culinaria.png",
              desc: "Alimentación y aprendizaje práctico.",
            },
          ].map((tienda) => (
            <div
              key={tienda.title}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
            >
              <Image
                src={tienda.img}
                alt={tienda.title}
                width={400}
                height={250}
                className="w-full"
              />
              <div className="p-4 text-center">
                <h3 className="font-bold text-xl mb-2">{tienda.title}</h3>
                <p>{tienda.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEMAS */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-8 text-amber-900">
          Temas de la Semana
        </h2>
        <ul className="space-y-3 text-center">
          <li>📖 Domingo – El Santuario Terrenal</li>
          <li>💧 Lunes – Jesús, el Agua de Vida</li>
          <li>🍞 Martes – Jesús, el Pan de Vida</li>
          <li>💡 Miércoles – Jesús, la Luz del Mundo</li>
          <li>🙏 Jueves – Jesús escucha nuestras oraciones</li>
          <li>👑 Viernes – Jesús, nuestro Sumo Sacerdote</li>
        </ul>
      </section>

      {/* PRECIO Y CTA */}
      <section className="bg-amber-700 text-white py-20 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Inscripciones Abiertas
        </h2>
        <p className="text-xl mb-6">
          💲 Valor de inscripción: <strong>$10.000</strong>
        </p>

        <Link
          href="/inscripcion"
          className="inline-block bg-white text-amber-800 font-bold px-10 py-4 rounded-full shadow-lg hover:bg-amber-100 transition"
        >
          Inscribí a tu hijo/a ahora
        </Link>
      </section>

      {/* CONTACTO */}
      <footer className="bg-amber-900 text-amber-100 py-10 text-center">
        <p className="mb-2 font-semibold">
          📍 IASD Villa Celina - Rivera 2215  
        </p>
        <p>📞 Contacto: 11-6350-4992</p>
        <p>📲 Instagram: iglesia.celina</p>
      </footer>
    </main>
  );
}

