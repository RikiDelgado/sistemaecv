// frontend/app/dashboard/asistencias/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/useAuth";

function formatFecha(fecha: string) {
  return fecha.split("T")[0];
}

function esHoy(fecha: string) {
  const hoy = new Date().toISOString().split("T")[0];
  return formatFecha(fecha) === hoy;
}

export default function AsistenciasPage() {
  const usuario = useAuth();
  const [dias, setDias] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/admin/asistencias/dias")
      .then(setDias)
      .catch((err) => setError(err.message));
  }, []);

  const metricas = useMemo(() => {
    const hoy = new Date();
    const mes = hoy.getMonth();
    const anio = hoy.getFullYear();

    const esteMes = dias.filter((d) => {
      const f = new Date(d.fecha);
      return f.getMonth() === mes && f.getFullYear() === anio;
    });

    return {
      total: dias.length,
      esteMes: esteMes.length,
      clases: 1,
      hoy: dias.some((d) => esHoy(d.fecha)) ? 1 : 0,
    };
  }, [dias]);

  if (!usuario) return null;

  return (
    <main className="min-h-screen p-6 space-y-6 bg-[#F6E9CF]">
      {/* Header */}
      <Link href="/dashboard" className="text-blue-600 underline">
        ⬅ Volver al panel principal
      </Link>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6B3E26]">
            Gestión de Asistencia
          </h1>
          <p className="text-[#8B5E3C]">
            Control de asistencia y reportes de puntualidad
          </p>
        </div>

        <Link
          href="/dashboard/asistencias/nuevo"
          className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 w-fit"
        >
          ➕ Nueva Asistencia
        </Link>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-3 bg-[#EED9B6] p-4 rounded-xl">
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
          📋 Lista de Asistencias
        </button>

        <div className="flex-1 flex items-center gap-2 text-[#6B3E26]">
          🔍 Buscar Alumno
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#F1DDC1] p-4 rounded-xl">
          <p className="text-sm text-[#8B5E3C]">Total Asistencias</p>
          <p className="text-2xl font-bold">{metricas.total}</p>
        </div>

        <div className="bg-[#F1DDC1] p-4 rounded-xl">
          <p className="text-sm text-[#8B5E3C]">Este Mes</p>
          <p className="text-2xl font-bold">{metricas.esteMes}</p>
        </div>

        <div className="bg-[#F1DDC1] p-4 rounded-xl">
          <p className="text-sm text-[#8B5E3C]">Clases</p>
          <p className="text-2xl font-bold">{metricas.clases}</p>
        </div>

        <div className="bg-[#F1DDC1] p-4 rounded-xl">
          <p className="text-sm text-[#8B5E3C]">Hoy</p>
          <p className="text-2xl font-bold">{metricas.hoy}</p>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {dias.map((dia) => (
          <div
            key={dia.id}
            className="bg-[#F3E3C8] rounded-xl p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
          >
            <div className="flex gap-4 items-start">
              <div className="bg-green-600 text-white rounded-full p-3 text-xl">
                📋
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#6B3E26]">
                  {dia.titulo}
                </h2>

                <p className="text-sm text-[#8B5E3C]">
                  📅 {formatFecha(dia.fecha)} &nbsp; 👤 Prof. Admin
                </p>

                <div className="flex gap-2 mt-2 text-sm">
                  <span className="bg-blue-200 px-3 py-1 rounded-full">
                    Clase: —
                  </span>
                </div>

                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-green-700">
                    ✅ Presentes: {dia.total_alumnos ?? 0}
                  </span>
                  <span className="text-yellow-600">⏰ Tardes: 0</span>
                  <span className="text-red-600">❌ Ausentes: 0</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/dashboard/asistencias/${dia.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Tomar asistencia 
                ✏️ Editar
              </Link>

              <button
                onClick={async () => {
                  if (!confirm("¿Eliminar este día de asistencia?")) return;
                  await apiFetch(`/admin/asistencias/dias/${dia.id}`, {
                    method: "DELETE",
                  });
                  setDias((prev) =>
                    prev.filter((d) => d.id !== dia.id)
                  );
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg">
                🗑 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </main>
  );
}
