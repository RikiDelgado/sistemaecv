//frontend/app/dashboard/asistencias/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/useAuth";

type Props = {
  params: Promise<{ id: string }>;
};

export default function TomarAsistencia({ params }: Props) {
  const { id } = use(params);
  const usuario = useAuth();
  const router = useRouter();
  const [lista, setLista] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/admin/asistencias/dias/${id}`)
      .then(setLista)
      .catch((err) => setError(err.message));
  }, [id]);

  if (!usuario) return null;

  function cambiarEstado(actual: string) {
    if (actual === "ausente") return "presente";
    if (actual === "presente") return "tarde";
    return "ausente";
  }

  async function actualizar(idRegistro: number, estado: string) {
    setLista((prev) =>
      prev.map((a) =>
        a.id === idRegistro ? { ...a, estado } : a
      )
    );

    await apiFetch(`/admin/asistencias/${idRegistro}`, {
      method: "PUT",
      body: JSON.stringify({ estado }),
    });
  }

  return (
    <main className="p-6 space-y-4">
      {/* 🔙 Navegación correcta */}
      <Link
        href="/dashboard/asistencias"
        className="inline-block text-blue-600 underline"
      >
        ⬅ Volver a asistencias
      </Link>

      <h1 className="text-xl font-bold">Tomar asistencia</h1>

      {error && <p className="text-red-600">{error}</p>}

      {lista.map((a) => (
        <div
          key={a.id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <span>
            {a.apellido}, {a.nombre}
          </span>

          <button
            onClick={() =>
              actualizar(a.id, cambiarEstado(a.estado))
            }
            className={`px-3 py-1 rounded text-white ${
              a.estado === "presente"
                ? "bg-green-600"
                : a.estado === "tarde"
                ? "bg-yellow-500"
                : "bg-red-600"
            }`}
          >
            {a.estado.toUpperCase()}
          </button>
        </div>
      ))}

      <button
        onClick={() => router.push("/dashboard/asistencias")}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar y volver
      </button>
    </main>
  );
}
