//frontend/app/dashboard/alumnos/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logout } from "../../lib/logout";
import { useAuth } from "../../lib/useAuth";

export default function AlumnosPage() {
  const usuario = useAuth();
  const router = useRouter();
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarAlumnos() {
      try {
        const data = await apiFetch("/alumnos");
        setAlumnos(data);
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes("Token")) {
          router.push("/login");
        }
      }
    }

    cargarAlumnos();
  }, [router]);

  if (!usuario) return null;

  return (
    <main className="min-h-screen p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Alumnos inscriptos</h1>

        <button
          onClick={() => logout(router)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      <Link
        href="/dashboard"
        className="inline-block text-blue-600 underline"
      >
        ⬅ Volver al panel principal
      </Link>

      {error && <p className="text-red-600">{error}</p>}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Apellido</th>
            <th className="border p-2">DNI</th>
            <th className="border p-2">Tutor</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.id}>
              <td className="border p-2">{alumno.nombre}</td>
              <td className="border p-2">{alumno.apellido}</td>
              <td className="border p-2">{alumno.dni}</td>
              <td className="border p-2">{alumno.tutor_nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
