//frontend/app/dashboard/profesores/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/useAuth";
import ProfesorCard from "./components/ProfesorCard";
import ProfesorModal from "./components/ProfesorModal";
import ProfesorStats from "./components/ProfesorStats";

export default function ProfesoresPage() {
  const router = useRouter();
  const usuario = useAuth();

  const [profesores, setProfesores] = useState<any[]>([]);
  const [clases, setClases] = useState<any[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [profesorEditando, setProfesorEditando] = useState<any>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const dataProfes = await apiFetch("/usuarios?rol=docente");
    const dataClases = await apiFetch("/clases");
    setProfesores(dataProfes);
    setClases(dataClases);
  }

  function abrirCrear() {
    setModoEdicion(false);
    setProfesorEditando(null);
    setMostrarModal(true);
  }

  function abrirEditar(profesor: any) {
    setModoEdicion(true);
    setProfesorEditando(profesor);
    setMostrarModal(true);
  }

  async function eliminarProfesor(id: number) {
    if (!confirm("¿Seguro que querés eliminar este profesor?")) return;
    await apiFetch(`/usuarios/${id}`, { method: "DELETE" });
    cargarDatos();
  }

  async function toggleActivo(profesor: any) {
    await apiFetch(`/usuarios/${profesor.id}/toggle`, {
      method: "PUT",
    });
    cargarDatos();
  }

  if (!usuario) return null;

  const total = profesores.length;
  const activos = profesores.filter((p) => p.activo).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e6c9a8] to-[#f3e6c9] p-6 space-y-6">
      
      {/* 🔙 BOTÓN VOLVER */}
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl shadow"
      >
        ← Volver al Panel Principal
      </button>

      <ProfesorStats
        total={total}
        activos={activos}
        clases={clases.length}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Profesores</h1>
        <button
          onClick={abrirCrear}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl shadow"
        >
          + Agregar Profesor
        </button>
      </div>

      <div className="space-y-6">
        {profesores.map((profesor) => (
          <ProfesorCard
            key={profesor.id}
            profesor={profesor}
            clases={clases}
            onEdit={() => abrirEditar(profesor)}
            onDelete={() => eliminarProfesor(profesor.id)}
            onToggle={() => toggleActivo(profesor)}
          />
        ))}
      </div>

      {mostrarModal && (
        <ProfesorModal
          onClose={() => setMostrarModal(false)}
          onSuccess={cargarDatos}
          clases={clases}
          profesor={profesorEditando}
          modoEdicion={modoEdicion}
        />
      )}
    </main>
  );
}
