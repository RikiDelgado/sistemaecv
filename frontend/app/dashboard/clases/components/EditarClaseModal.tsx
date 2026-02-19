//frontend/app/dashboard/clases/components/EditarClaseModal.tsx
"use client";

import { useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function EditarClaseModal({
  clase,
  docentes,
  onCerrar,
  onGuardado,
}: any) {
  const [nombre, setNombre] = useState(clase.nombre);
  const [capacidad, setCapacidad] = useState(
    clase.capacidad_maxima
  );
  const [docenteId, setDocenteId] = useState(
    clase.docente_id || ""
  );

  async function guardar(e: React.FormEvent) {
    e.preventDefault();

    await apiFetch(`/clases/${clase.id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre,
        capacidad_maxima: capacidad,
        docente_id: docenteId || null,
      }),
    });

    onGuardado();
    onCerrar();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-[#F3E1C7] p-6 rounded-2xl w-[400px] space-y-4">
        <h2 className="text-xl font-bold text-[#4B2E1E]">
          Editar Clase
        </h2>

        <form onSubmit={guardar} className="space-y-3">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 rounded-lg border"
            required
          />

          <input
            type="number"
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
            <option value="">Sin profesor</option>
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
