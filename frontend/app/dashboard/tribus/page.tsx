//frontend/app/dashboard/tribus/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/useAuth";

export default function TribusPage() {
  const usuario = useAuth();

  const [tribus, setTribus] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [seleccion, setSeleccion] = useState<Record<number, number>>({});
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    apiFetch("/tribus")
      .then(setTribus)
      .catch((err) => setError(err.message));

    apiFetch("/usuarios?rol=docente")
      .then(setDocentes)
      .catch(() => {});
  }, []);

  async function crearTribu(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const nueva = await apiFetch("/tribus", {
        method: "POST",
        body: JSON.stringify({ nombre }),
      });

      setTribus((prev) => [...prev, nueva]);
      setNombre("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function asignarDocente(tribuId: number) {
    const docenteId = seleccion[tribuId];
    if (!docenteId) return;

    try {
      await apiFetch(`/tribus/${tribuId}/asignar-docente`, {
        method: "POST",
        body: JSON.stringify({ docenteId }),
      });

      setMensaje("Docente asignado correctamente");

      const nuevasTribus = await apiFetch("/tribus");
      setTribus(nuevasTribus);
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (!usuario) return null;

  return (
    <main className="p-6 space-y-6 max-w-2xl">
      <Link href="/dashboard" className="text-blue-600 underline">
        ⬅ Volver al panel principal
      </Link>

      <h1 className="text-2xl font-bold">Gestión de tribus</h1>

      {error && <p className="text-red-600">{error}</p>}
      {mensaje && <p className="text-green-600">{mensaje}</p>}

      {/* Crear tribu */}
      <form onSubmit={crearTribu} className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Nombre de la tribu"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Crear
        </button>
      </form>

      {/* Listado */}
      <ul className="space-y-4">
        {tribus.map((tribu) => (
          <li key={tribu.id} className="border p-4 rounded space-y-2">
            <div className="font-semibold">{tribu.nombre}</div>

            <div className="text-sm text-gray-600">
              {tribu.docente_nombre
                ? `Docente: ${tribu.docente_nombre}`
                : "Sin docente"}
            </div>

            <select
              className="border p-2 rounded w-full"
              defaultValue=""
              onChange={(e) =>
                setSeleccion({
                  ...seleccion,
                  [tribu.id]: Number(e.target.value),
                })
              }
            >
              <option value="">Seleccionar docente</option>
              {docentes.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre} ({d.email})
                </option>
              ))}
            </select>

            <button
              onClick={() => asignarDocente(tribu.id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Asignar
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
