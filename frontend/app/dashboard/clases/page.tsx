//frontend/app/dashboard/clases/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/useAuth";

import MetricCard from "./components/MetricCard";
import ClaseCard from "./components/ClaseCard";
import NuevaClaseModal from "./components/NuevaClaseModal";
import EditarClaseModal from "./components/EditarClaseModal";
import EstudiantesPorClase from "./components/EstudiantesPorClase";

export default function ClasesPage() {
  const usuario = useAuth();

  const [clases, setClases] = useState<any[]>([]);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);

  const [vista, setVista] = useState<"clases" | "estudiantes">("clases");
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [claseEditar, setClaseEditar] = useState<any>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    try {
      const [c, a, d] = await Promise.all([
        apiFetch("/clases"),
        apiFetch("/alumnos"),
        apiFetch("/usuarios?rol=docente"),
      ]);

      setClases(c);
      setAlumnos(a);
      setDocentes(d);
    } catch (err: any) {
      setError(err.message);
    }
  }

  /* ================= METRICAS ================= */

  const totalClases = clases.length;
  const totalAlumnos = alumnos.length;
  const sinClase = alumnos.filter((a) => !a.clase_id).length;

  const clasesLlenas = clases.filter((c) => {
    const cantidad = alumnos.filter(
      (a) => a.clase_id === c.id
    ).length;
    return cantidad >= c.capacidad_maxima;
  }).length;

  if (!usuario) return null;

  return (
    <main className="min-h-screen bg-[#D8B892] p-6 space-y-6">
      <Link
        href="/dashboard"
        className="text-[#6B3E26] underline"
      >
        ⬅ Volver
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#4B2E1E]">
            Gestión de Clases
          </h1>
          <p className="text-[#6B3E26]">
            Crear, organizar y gestionar clases
          </p>
        </div>

        <button
          onClick={() => setMostrarNueva(true)}
          className="bg-[#0F8B8D] text-white px-6 py-2 rounded-xl"
        >
          + Nueva Clase
        </button>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Clases" value={totalClases} />
        <MetricCard label="Total Estudiantes" value={totalAlumnos} />
        <MetricCard label="Estudiantes sin clase" value={sinClase} />
        <MetricCard label="Clases llenas" value={clasesLlenas} />
      </div>

      {/* SUBMODULO */}
      <div className="bg-[#E6C9A8] p-2 rounded-xl flex">
        <button
          onClick={() => setVista("clases")}
          className={`flex-1 py-2 rounded-xl ${
            vista === "clases"
              ? "bg-[#0F8B8D] text-white"
              : ""
          }`}
        >
          📚 Clases
        </button>

        <button
          onClick={() => setVista("estudiantes")}
          className={`flex-1 py-2 rounded-xl ${
            vista === "estudiantes"
              ? "bg-[#0F8B8D] text-white"
              : ""
          }`}
        >
          👥 Estudiantes por Clase
        </button>
      </div>

      {/* CONTENIDO */}
      {vista === "clases" && (
        <div className="space-y-4">
          {clases.map((clase) => (
            <ClaseCard
              key={clase.id}
              clase={clase}
              alumnos={alumnos}
              onEditar={() => setClaseEditar(clase)}
              onEliminar={cargarTodo}
            />
          ))}
        </div>
      )}

      {vista === "estudiantes" && (
        <EstudiantesPorClase
          clases={clases}
          alumnos={alumnos}
          onActualizar={cargarTodo}
        />
      )}

      {mostrarNueva && (
        <NuevaClaseModal
          docentes={docentes}
          onCerrar={() => setMostrarNueva(false)}
          onCreado={cargarTodo}
        />
      )}

      {claseEditar && (
        <EditarClaseModal
          clase={claseEditar}
          docentes={docentes}
          onCerrar={() => setClaseEditar(null)}
          onGuardado={cargarTodo}
        />
      )}

      {error && <p className="text-red-600">{error}</p>}
    </main>
  );
}
