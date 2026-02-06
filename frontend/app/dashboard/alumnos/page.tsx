//frontend/app/dashboard/alumnos/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/useAuth";

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

  useEffect(() => {
    async function cargarAlumnos() {
      try {
        const data = await apiFetch("/alumnos");

        // Ordenar por nombre
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

    cargarAlumnos();
  }, [router]);

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

        <Link
          href="/dashboard/alumnos/nuevo"
          className="bg-[#c98b1f] text-white px-4 py-2 rounded-xl shadow hover:bg-[#b57b1b]"
        >
          ➕ Agregar Estudiante
        </Link>
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
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                  ✏️ Editar
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  🗑 Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
=======
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Apellido</th>
            <th className="border p-2">Nombre del tutor</th>
            <th className="border p-2">Teléfono del tutor</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.id}>
              <td className="border p-2">{alumno.nombre}</td>
              <td className="border p-2">{alumno.apellido}</td>
              <td className="border p-2">{alumno.tutor_nombre}</td>
              <td className="border p-2">{alumno.tutor_telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
