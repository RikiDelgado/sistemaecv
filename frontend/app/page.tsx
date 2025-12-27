//frontend/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold text-center">
        Escuela Cristiana de Vacaciones
      </h1>

      <p className="text-center max-w-md">
        Sistema de inscripción y gestión para la Escuela Cristiana de Vacaciones
        de la Iglesia Adventista del Séptimo Día
      </p>

      <div className="flex gap-4">
        <Link
          href="/inscripcion"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Inscribir niño
        </Link>

        <Link
          href="/login"
          className="border border-gray-400 px-6 py-3 rounded"
        >
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
}
