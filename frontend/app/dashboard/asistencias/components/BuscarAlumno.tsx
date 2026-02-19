//frontend/app/dashboard/asistencias/components/BuscarAlumno.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";

export default function BuscarAlumno() {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<any>(null);
  const [historial, setHistorial] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (busqueda.length < 2) {
      setResultados([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const data = await apiFetch(
          `/admin/asistencias/buscar-alumno?q=${busqueda}`
        );
        setResultados(data);
      } catch (err: any) {
        setError(err.message);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [busqueda]);

  async function cargarHistorial(alumno: any) {
    setAlumnoSeleccionado(alumno);
    const data = await apiFetch(
      `/admin/asistencias/alumno/${alumno.id}`
    );
    setHistorial(data);
  }

  const resumen = historial.reduce(
    (acc, item) => {
      if (item.estado === "presente") acc.presentes++;
      if (item.estado === "tarde") acc.tardes++;
      if (item.estado === "ausente") acc.ausentes++;
      return acc;
    },
    { presentes: 0, tardes: 0, ausentes: 0 }
  );

  return (
    <div className="bg-[#F3E3C8] p-6 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-[#6B3E26]">
        Buscar Estudiante
      </h2>

      <input
        type="text"
        placeholder="Escriba al menos 2 caracteres..."
        className="w-full border p-3 rounded-lg"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* Resultados */}
      {resultados.length > 0 && (
        <div className="bg-white rounded-lg shadow p-2 space-y-2">
          {resultados.map((alumno) => (
            <div
              key={alumno.id}
              onClick={() => cargarHistorial(alumno)}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              {alumno.apellido}, {alumno.nombre}
            </div>
          ))}
        </div>
      )}

      {/* Alumno seleccionado */}
      {alumnoSeleccionado && (
        <div className="space-y-4">
          <div className="bg-[#EED9B6] p-4 rounded-xl">
            <h3 className="font-bold text-lg">
              {alumnoSeleccionado.nombre}{" "}
              {alumnoSeleccionado.apellido}
            </h3>

            <div className="grid grid-cols-3 gap-4 mt-3 text-center">
              <div className="bg-green-200 p-3 rounded">
                <p className="text-xl font-bold">
                  {resumen.presentes}
                </p>
                <p>Presentes</p>
              </div>

              <div className="bg-yellow-200 p-3 rounded">
                <p className="text-xl font-bold">
                  {resumen.tardes}
                </p>
                <p>Tardes</p>
              </div>

              <div className="bg-red-200 p-3 rounded">
                <p className="text-xl font-bold">
                  {resumen.ausentes}
                </p>
                <p>Ausentes</p>
              </div>
            </div>
          </div>

          {/* Historial */}
          <div className="space-y-2">
            <h4 className="font-bold">Historial de Asistencias</h4>

            {historial.map((h) => (
              <div
                key={h.id}
                className="bg-white p-3 rounded flex justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {h.clase_nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    {h.fecha}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded text-white ${
                    h.estado === "presente"
                      ? "bg-green-600"
                      : h.estado === "tarde"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                >
                  {h.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
