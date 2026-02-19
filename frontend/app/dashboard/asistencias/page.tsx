// frontend/app/dashboard/asistencias/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/useAuth";
import AsistenciaModal from "./components/AsistenciaModal";
import BuscarAlumno from "./components/BuscarAlumno";
import ClaseCard from "./components/ClaseCard";

function formatFecha(fecha: string) {
  return fecha.split("T")[0];
}

function esHoy(fecha: string) {
  const hoy = new Date().toISOString().split("T")[0];
  return formatFecha(fecha) === hoy;
}

export default function AsistenciasPage() {
  const usuario = useAuth();

  const [clases, setClases] = useState<any[]>([]);
  const [dias, setDias] = useState<any[]>([]);
  const [claseSeleccionada, setClaseSeleccionada] =
    useState<any>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [error, setError] = useState("");
  const [vista, setVista] =
    useState<"lista" | "buscar">("lista");

  /* ===============================
     CARGA INICIAL
  =================================*/
  useEffect(() => {
    cargarClases();
    cargarDias();
  }, []);

  async function cargarClases() {
    try {
      const data = await apiFetch("/clases");
      setClases(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function cargarDias() {
    try {
      const data = await apiFetch(
        "/admin/asistencias/dias"
      );
      setDias(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  /* ===============================
     MÉTRICAS
  =================================*/
  const metricas = useMemo(() => {
    const hoy = new Date();
    const mes = hoy.getMonth();
    const anio = hoy.getFullYear();

    const esteMes = dias.filter((d) => {
      const f = new Date(d.fecha);
      return (
        f.getMonth() === mes &&
        f.getFullYear() === anio
      );
    });

    return {
      total: dias.length,
      esteMes: esteMes.length,
      clases: clases.length,
      hoy: dias.some((d) => esHoy(d.fecha)) ? 1 : 0,
    };
  }, [dias, clases]);

  if (!usuario) return null;

  return (
    <main className="min-h-screen p-6 space-y-6 bg-[#F6E9CF]">
      <Link
        href="/dashboard"
        className="text-blue-600 underline"
      >
        ⬅ Volver al panel principal
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-[#6B3E26]">
          Gestión de Asistencia
        </h1>
        <p className="text-[#8B5E3C]">
          Control de asistencia y reportes
        </p>
      </div>

      {/* BOTONES SUPERIORES */}
      <div className="flex gap-4 bg-[#EED9B6] p-4 rounded-xl">
        <button
          onClick={() => {
            setVista("lista");
            setClaseSeleccionada(null);
          }}
          className={`px-4 py-2 rounded-lg ${
            vista === "lista"
              ? "bg-[#6B3E26] text-white"
              : "bg-gray-200"
          }`}
        >
          📋 Lista de Asistencias
        </button>

        <button
          onClick={() => {
            setVista("buscar");
            setClaseSeleccionada(null);
          }}
          className={`px-4 py-2 rounded-lg ${
            vista === "buscar"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          🔍 Buscar Alumno
        </button>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Asistencias"
          value={metricas.total}
        />
        <MetricCard
          label="Este Mes"
          value={metricas.esteMes}
        />
        <MetricCard
          label="Clases"
          value={metricas.clases}
        />
        <MetricCard
          label="Hoy"
          value={metricas.hoy}
        />
      </div>

      {/* VISTA BUSCAR */}
      {vista === "buscar" && <BuscarAlumno />}

      {/* LISTA DE CLASES */}
      {vista === "lista" && !claseSeleccionada && (
        <div className="space-y-4">
          {clases.map((clase) => (
            <ClaseCard
              key={clase.id}
              clase={clase}
              onClick={setClaseSeleccionada}
            />
          ))}
        </div>
      )}

      {/* DÍAS DE LA CLASE */}
      {vista === "lista" && claseSeleccionada && (
        <div className="space-y-4">
          <button
            onClick={() => setClaseSeleccionada(null)}
            className="text-blue-600 underline"
          >
            ⬅ Volver a clases
          </button>

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#6B3E26]">
              {claseSeleccionada.nombre}
            </h2>

            {/* BOTÓN CREAR ASISTENCIA */}
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              ➕ Crear Asistencia
            </button>
          </div>

          {dias
            .filter(
              (d) =>
                d.clase_id === claseSeleccionada.id
            )
            .map((dia) => (
              <div
                key={dia.id}
                className="bg-[#F3E3C8] rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">
                    📅 {formatFecha(dia.fecha)}
                  </h3>

                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-green-700">
                      ✅ {dia.presentes ?? 0}
                    </span>
                    <span className="text-yellow-600">
                      ⏰ {dia.tardes ?? 0}
                    </span>
                    <span className="text-red-600">
                      ❌ {dia.ausentes ?? 0}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setModalAbierto(true)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    {esHoy(dia.fecha)
                      ? "✏️ Editar"
                      : "🟢 Tomar"}
                  </button>

                  <button
                    onClick={async () => {
                      if (
                        !confirm(
                          "¿Eliminar asistencia?"
                        )
                      )
                        return;

                      await apiFetch(
                        `/admin/asistencias/dias/${dia.id}`,
                        {
                          method: "DELETE",
                        }
                      );

                      cargarDias();
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}

          {/* BOTÓN SI NO EXISTE ASISTENCIA HOY */}
          {!dias.some(
            (d) =>
              d.clase_id ===
                claseSeleccionada.id &&
              esHoy(d.fecha)
          ) && (
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              🟢 Tomar asistencia de hoy
            </button>
          )}
        </div>
      )}

      <AsistenciaModal
        abierto={modalAbierto}
        clase={claseSeleccionada}
        onCerrar={() => setModalAbierto(false)}
        onGuardado={cargarDias}
      />

      {error && (
        <p className="text-red-600">{error}</p>
      )}
    </main>
  );
}

/* COMPONENTE MÉTRICA */
function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-[#F1DDC1] p-4 rounded-xl">
      <p className="text-sm text-[#8B5E3C]">
        {label}
      </p>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}
