//frontend/app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useAuth } from "../lib/useAuth";

export default function DashboardPage() {
  const usuario = useAuth();

  if (!usuario) return null;

  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Panel de Control
      </h1>

      <p>
        Bienvenido <strong>{usuario.nombre}</strong> ({usuario.rol})
      </p>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/dashboard/alumnos"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ver alumnos
        </Link>

        <Link
          href="/dashboard/asistencias"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Asistencias
        </Link>
      </div>
    </main>
  );
}
