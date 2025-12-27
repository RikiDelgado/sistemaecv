//frontend/app/dashboard/asistencia/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

export default function AsistenciaPage() {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    apiFetch("/alumnos")
      .then(setAlumnos)
      .catch(() => {});
  }, []);

  async function marcarAsistencia(alumnoId: number, presente: boolean) {
    try {
      await apiFetch("/asistencias", {
        method: "POST",
        body: JSON.stringify({
          alumno_id: alumnoId,
          fecha: new Date().toISOString().slice(0, 10),
          presente,
        }),
      });

      setMensaje("Asistencia registrada");
    } catch (error) {
      setMensaje("Error al guardar asistencia");
    }
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tomar asistencia
      </h1>

      {mensaje && <p>{mensaje}</p>}

      {alumnos.map((alumno) => (
        <div
          key={alumno.id}
          className="flex justify-between items-center border p-2 mb-2"
        >
          <span>
            {alumno.apellido}, {alumno.nombre}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => marcarAsistencia(alumno.id, true)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Presente
            </button>

            <button
              onClick={() => marcarAsistencia(alumno.id, false)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Ausente
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}
