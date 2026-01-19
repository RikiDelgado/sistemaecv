// frontend/app/dashboard/asistencias/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/useAuth";

export default function AsistenciasPage() {
  const usuario = useAuth();
  const [dias, setDias] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/admin/asistencias/dias")
      .then(setDias)
      .catch((err) => setError(err.message));
  }, []);

  if (!usuario) return null;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Asistencias</h1>

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      <Link
        href="/dashboard/asistencias/nuevo"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded"
      >
        ➕ Crear día de asistencia
      </Link>

      <ul className="space-y-2">
        {dias.map((dia) => (
          <li
            key={dia.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <span>
              {dia.titulo} – {dia.fecha}
            </span>

            <Link
              href={`/dashboard/asistencias/${dia.id}`}
              className="text-blue-600 underline"
            >
              Ver
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
