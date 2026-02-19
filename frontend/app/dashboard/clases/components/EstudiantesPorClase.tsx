//frontend/app/dashboard/clases/components/EstudiantesPorClase.tsx
"use client";

import { useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function EstudiantesPorClase({
  clases,
  alumnos,
  onActualizar,
}: any) {
  const [claseSeleccionada, setClaseSeleccionada] =
    useState("");

  const filtrados =
    claseSeleccionada === "sin"
      ? alumnos.filter((a: any) => !a.clase_id)
      : alumnos.filter(
          (a: any) =>
            a.clase_id === Number(claseSeleccionada)
        );

  /* ===============================
     MOVER ALUMNO ENTRE CLASES
  =============================== */
  async function moverAlumno(
    alumnoId: number,
    nuevaClaseId: string
  ) {
    try {
      await apiFetch(`/alumnos/${alumnoId}`, {
        method: "PUT",
        body: JSON.stringify({
          clase_id:
            nuevaClaseId === ""
              ? null
              : Number(nuevaClaseId),
        }),
      });

      onActualizar();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar alumno");
    }
  }

  return (
    <div className="bg-[#EED9C4] p-6 rounded-2xl space-y-6">
      {/* ===============================
          SELECT CLASE
      =============================== */}
      <div>
        <label className="text-[#4B2E1E] font-semibold">
          Selecciona una clase:
        </label>

        <select
          value={claseSeleccionada}
          onChange={(e) =>
            setClaseSeleccionada(e.target.value)
          }
          className="w-full p-2 rounded-lg mt-2"
        >
          <option value="">-- Elegir --</option>
          <option value="sin">
            Estudiantes sin clase
          </option>
          {clases.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* ===============================
          LISTA DE ESTUDIANTES
      =============================== */}
      {claseSeleccionada && (
        <div className="space-y-4">
          {filtrados.length === 0 && (
            <p className="text-gray-600">
              No hay estudiantes en esta clase.
            </p>
          )}

          {filtrados.map((alumno: any) => (
            <div
              key={alumno.id}
              className="bg-white p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {alumno.nombre} {alumno.apellido}
                </p>
                <p className="text-sm text-gray-600">
                  DNI: {alumno.dni}
                </p>
              </div>

              <select
                value={alumno.clase_id || ""}
                onChange={(e) =>
                  moverAlumno(
                    alumno.id,
                    e.target.value
                  )
                }
                className="p-2 rounded-lg border"
              >
                <option value="">
                  Sin clase
                </option>
                {clases.map((c: any) => (
                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
