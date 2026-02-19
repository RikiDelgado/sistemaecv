//frontend/app/dashboard/asistencias/components/AsistenciaModal.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function AsistenciaModal({
  abierto,
  clase,
  onCerrar,
  onGuardado,
}: any) {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [diaId, setDiaId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (abierto && clase) {
      crearDia();
    }
  }, [abierto]);

  async function crearDia() {
    setCargando(true);

    const hoy = new Date().toISOString().split("T")[0];

    const nuevoDia = await apiFetch("/admin/asistencias/dias", {
      method: "POST",
      body: JSON.stringify({
        fecha: hoy,
        clase_id: clase.id,
        titulo: "Día de asistencia",
      }),
    });

    setDiaId(nuevoDia.id);

    const detalle = await apiFetch(
      `/admin/asistencias/dias/${nuevoDia.id}`
    );

    setAlumnos(detalle);
    setCargando(false);
  }

  async function guardar() {
    await apiFetch("/admin/asistencias/tomar", {
      method: "POST",
      body: JSON.stringify({
        dia_id: diaId,
        asistencias: alumnos.map((a) => ({
          id: a.id,
          estado: a.estado,
        })),
      }),
    });

    onGuardado();
    onCerrar();
  }

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Tomar asistencia - {clase?.nombre}
        </h2>

        {cargando ? (
          <p>Cargando...</p>
        ) : (
          <>
            {alumnos.map((alumno, index) => (
              <div
                key={alumno.id}
                className="flex justify-between items-center border-b py-2"
              >
                <span>
                  {alumno.apellido}, {alumno.nombre}
                </span>

                <select
                  value={alumno.estado}
                  onChange={(e) => {
                    const copia = [...alumnos];
                    copia[index].estado = e.target.value;
                    setAlumnos(copia);
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value="presente">
                    ✅ Presente
                  </option>
                  <option value="tarde">
                    ⏰ Tarde
                  </option>
                  <option value="ausente">
                    ❌ Ausente
                  </option>
                </select>
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onCerrar}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={guardar}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Guardar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
