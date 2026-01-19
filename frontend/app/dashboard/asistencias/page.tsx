// frontend/app/dashboard/asistencias/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/useAuth";
import { logout } from "../../lib/logout";

export default function AsistenciasPage() {
  const usuario = useAuth();
  const router = useRouter();
  const [dias, setDias] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/admin/asistencias/dias")
      .then(setDias)
      .catch((err) => setError(err.message));
  }, []);

  if (!usuario) return null;

  async function eliminarDia(id: number) {
    if (!confirm("¿Seguro que querés eliminar este día de asistencia?")) return;

    await apiFetch(`/admin/asistencias/dias/${id}`, {
      method: "DELETE",
    });

    setDias((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <main className="p-6 space-y-4">
      {/* 🔙 Navegación correcta */}
      <Link
        href="/dashboard"
        className="inline-block text-blue-600 underline"
      >
        ⬅ Volver al panel principal
      </Link>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Asistencias</h1>

        <button
          onClick={() => logout(router)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

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

            <div className="flex gap-3">
              <Link
                href={`/dashboard/asistencias/${dia.id}`}
                className="text-blue-600 underline"
              >
                Ver
              </Link>

              <button
                onClick={() => eliminarDia(dia.id)}
                className="text-red-600 underline"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
