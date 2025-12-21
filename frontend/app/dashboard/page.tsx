"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("usuario");

    if (!token || !user) {
      router.push("/login");
      return;
    }

    setUsuario(JSON.parse(user));
  }, [router]);

  if (!usuario) return null;

  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Panel de Control
      </h1>

      <p>
        Bienvenido <strong>{usuario.nombre}</strong> ({usuario.rol})
      </p>

      <div className="flex gap-4">
        <Link
          href="/dashboard/alumnos"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ver alumnos
        </Link>

        <Link
          href="/dashboard/asistencia"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Tomar asistencia
        </Link>
      </div>
    </main>
  );
}
