//frontend/app/dashboard/clases/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../lib/useAuth";

export default function ClasesPage() {
  const usuario = useAuth();

  const [clases, setClases] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [seleccion, setSeleccion] = useState<Record<number, number>>({});
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    apiFetch("/clases")
      .then(setClases)
      .catch((err) => setError(err.message));

    apiFetch("/usuarios?rol=docente")
      .then(setDocentes)
      .catch(() => {});
  }, []);

  async function crearClase(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const nueva = await apiFetch("/clases", {
        method: "POST",
        body: JSON.stringify({ nombre }),
      });

      setClases((prev) => [...prev, nueva]);
      setNombre("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function asignarDocente(claseId: number) {
    const docenteId = seleccion[claseId];
    if (!docenteId) return;

    try {
      await apiFetch(`/clases/${claseId}/asignar-docente`, {
        method: "POST",
        body: JSON.stringify({ docenteId }),
      });

      setMensaje("Docente asignado correctamente");

      const nuevasClases = await apiFetch("/clases");
      setClases(nuevasClases);
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

      <h1 className="text-2xl font-bold">Gestión de clases</h1>

      {error && <p className="text-red-600">{error}</p>}
      {mensaje && <p className="text-green-600">{mensaje}</p>}

      {/* Crear clase */}
      <form onSubmit={crearClase} className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Nombre de la clase"
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
        {clases.map((clase) => (
          <li key={clase.id} className="border p-4 rounded space-y-2">
            <div className="font-semibold">{clase.nombre}</div>

            <div className="text-sm text-gray-600">
              {clase.docente_nombre
                ? `Docente: ${clase.docente_nombre}`
                : "Sin docente"}
            </div>

            <select
              className="border p-2 rounded w-full"
              defaultValue=""
              onChange={(e) =>
                setSeleccion({
                  ...seleccion,
                  [clase.id]: Number(e.target.value),
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
              onClick={() => asignarDocente(clase.id)}
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
