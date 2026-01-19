// frontend/app/dashboard/asistencias/nuevo/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/useAuth";

export default function NuevoDiaPage() {
  const usuario = useAuth();
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");

  if (!usuario) return null;

  async function crearDia(e: React.FormEvent) {
    e.preventDefault();

    await apiFetch("/admin/asistencias/dias", {
      method: "POST",
      body: JSON.stringify({ titulo, fecha }),
    });

    router.push("/dashboard/asistencias");
  }

  return (
    <main className="p-6 max-w-md space-y-4">
      <h1 className="text-xl font-bold">
        Nuevo día de asistencia
      </h1>

      <form onSubmit={crearDia} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Crear
        </button>
      </form>
    </main>
  );
}
