//frontend/app/dashboard/alumnos/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function AlumnosPage() {
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

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">
        Alumnos inscriptos
      </h1>

      {error && (
        <p className="text-red-600">{error}</p>
      )}

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
