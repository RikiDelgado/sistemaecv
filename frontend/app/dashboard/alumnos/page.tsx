// frontend/app/dashboard/alumnos/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/useAuth";

import AlumnoModal from "./components/AlumnoModal";
import ConfirmDelete from "./components/ConfirmDelete";

/* Helpers */
function calcularEdad(fecha: string) {
  const nacimiento = new Date(fecha);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

function iniciales(nombre: string, apellido: string) {
  return `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase();
}

function formatearFechaISO(fecha: string) {
  return fecha.split("T")[0];
}

export default function AlumnosPage() {
  const usuario = useAuth();
  const router = useRouter();

  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  // 👉 Estados nuevos
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editarAlumno, setEditarAlumno] = useState<any>(null);
  const [eliminarAlumno, setEliminarAlumno] = useState<any>(null);

  // 👉 Función reutilizable (antes estaba dentro del useEffect)
  async function cargarAlumnos() {
    try {
      const data = await apiFetch("/alumnos");

      const ordenados = data.sort((a: any, b: any) =>
        a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
      );

      setAlumnos(ordenados);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes("Token")) {
        router.push("/login");
      }
    }
  }

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((a) =>
      `${a.nombre} ${a.apellido}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [alumnos, busqueda]);

  if (!usuario) return null;

  return (
    <main className="min-h-screen bg-[#f3e2c7] p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#5b3a1d]">
            Gestión de Estudiantes
          </h1>
          <p className="text-sm text-[#7a5434]">
            Administra matrículas y expedientes académicos
          </p>
        </div>

        {/* 👉 Botón Agregar */}
        <button
          onClick={() => {
            setEditarAlumno(null);
            setModalAbierto(true);
          }}
          className="bg-[#c98b1f] text-white px-4 py-2 rounded-xl shadow hover:bg-[#b57b1b]"
        >
          ➕ Agregar Estudiante
        </button>
      </div>

      {/* Volver */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 bg-[#f7e7cf] px-4 py-2 rounded-xl shadow text-[#5b3a1d] hover:bg-[#eed6b3]"
      >
        ⬅ Volver al panel principal
      </Link>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#f7e7cf] rounded-xl p-4 shadow">
          <p className="text-sm text-[#7a5434]">Total Estudiantes</p>
          <p className="text-2xl font-bold text-[#5b3a1d]">
            {alumnos.length}
          </p>
        </div>

        <div className="bg-[#f7e7cf] rounded-xl p-4 shadow">
          <p className="text-sm text-[#7a5434]">Activos</p>
          <p className="text-2xl font-bold text-green-700">
            {alumnos.length}
          </p>
        </div>

        <div className="bg-[#f7e7cf] rounded-xl p-4 shadow">
          <p className="text-sm text-[#7a5434]">Clases</p>
          <p className="text-2xl font-bold text-[#5b3a1d]">—</p>
        </div>
      </div>

      {/* Buscador */}
      <input
        type="text"
        placeholder="🔍 Buscar estudiante por nombre o apellido..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full p-3 rounded-xl border border-[#d2b48c] focus:outline-none"
      />

      {error && <p className="text-red-600">{error}</p>}

      {/* Cards */}
      <div className="space-y-4">
        {alumnosFiltrados.map((alumno) => {
          const edad = calcularEdad(alumno.fecha_nacimiento);

          return (
            <div
              key={alumno.id}
              className="bg-[#f7e7cf] rounded-2xl shadow-md p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              {/* Info */}
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-[#c98b1f] text-white flex items-center justify-center font-bold text-lg">
                  {iniciales(alumno.nombre, alumno.apellido)}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#5b3a1d]">
                    {alumno.nombre} {alumno.apellido}{" "}
                    {alumno.genero === "F" ? "👧" : "👦"}
                  </h2>

                  <p className="text-sm text-[#7a5434]">
                    {edad} años ({formatearFechaISO(alumno.fecha_nacimiento)})
                  </p>

                  {alumno.talle_remera && (
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Talle: {alumno.talle_remera}
                    </span>
                  )}
                </div>
              </div>

              {/* Tutor */}
              <div className="text-sm text-[#5b3a1d] space-y-1">
                <p>
                  👤 Tutor:{" "}
                  <strong>
                    {alumno.tutor_nombre} {alumno.tutor_apellido}
                  </strong>
                </p>
                {alumno.tutor_telefono && (
                  <p>📞 {alumno.tutor_telefono}</p>
                )}
                {alumno.direccion && <p>📍 {alumno.direccion}</p>}
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditarAlumno(alumno);
                    setModalAbierto(true);
                  }}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                >
                  ✏️ Editar
                </button>

                <button
                  onClick={() => setEliminarAlumno(alumno)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 👉 Modales */}
      <AlumnoModal
        abierto={modalAbierto}
        alumno={editarAlumno}
        onCerrar={() => setModalAbierto(false)}
        onGuardado={() => cargarAlumnos()}
      />

      <ConfirmDelete
        abierto={!!eliminarAlumno}
        onCancelar={() => setEliminarAlumno(null)}
        onConfirmar={async () => {
          await apiFetch(`/alumnos/${eliminarAlumno.id}`, { method: "DELETE" });
          setEliminarAlumno(null);
          cargarAlumnos();
        }}
      />
    </main>
  );
}
