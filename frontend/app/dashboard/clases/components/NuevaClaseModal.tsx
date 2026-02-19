//frontend/app/dashboard/clases/components/NuevaClaseModal.tsx
"use client";

import { useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function NuevaClaseModal({
  docentes,
  onCerrar,
  onCreado,
}: any) {
  const [nombre, setNombre] = useState("");
  const [capacidad, setCapacidad] = useState(30);
  const [docenteId, setDocenteId] = useState("");
  const [error, setError] = useState("");

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await apiFetch("/clases", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          capacidad_maxima: capacidad,
          docente_id: docenteId || null,
        }),
      });

      onCreado();
      onCerrar();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-[#F3E1C7] p-6 rounded-2xl w-[400px] space-y-4">
        <h2 className="text-xl font-bold text-[#4B2E1E]">
          Nueva Clase
        </h2>

        <form onSubmit={crear} className="space-y-3">
          <input
            placeholder="Nombre de la clase"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 rounded-lg border"
            required
          />

          <input
            type="number"
            placeholder="Capacidad máxima"
            value={capacidad}
            onChange={(e) =>
              setCapacidad(Number(e.target.value))
            }
            className="w-full p-2 rounded-lg border"
            required
          />

          <select
            value={docenteId}
            onChange={(e) =>
              setDocenteId(e.target.value)
            }
            className="w-full p-2 rounded-lg border"
          >
            <option value="">Asignar profesor</option>
            {docentes.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 rounded-lg bg-gray-300"
            >
              Cancelar
            </button>

            <button className="px-4 py-2 rounded-lg bg-[#0F8B8D] text-white">
              Crear
            </button>
          </div>
        </form>

        {error && (
          <p className="text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
