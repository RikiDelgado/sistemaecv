//frontend/app/dashboard/profesores/components/ProfesorStats.tsx
import { useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function ProfesorModal({
  onClose,
  onSuccess,
  clases,
  profesor,
  modoEdicion,
}: any) {
  const [nombre, setNombre] = useState(profesor?.nombre || "");
  const [email, setEmail] = useState(profesor?.email || "");
  const [password, setPassword] = useState("");
  const [claseId, setClaseId] = useState(
    profesor?.clase_id || ""
  );

  async function guardar(e: any) {
    e.preventDefault();

    const body: any = {
      nombre,
      email,
      rol: "docente",
      clase_id: claseId,
    };

    if (password) body.password = password;

    if (modoEdicion) {
      await apiFetch(`/usuarios/${profesor.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    } else {
      await apiFetch("/usuarios", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }

    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[600px] p-6 shadow-xl space-y-4">
        <h2 className="text-xl font-bold">
          {modoEdicion ? "Editar Profesor" : "Agregar Profesor"}
        </h2>

        <form onSubmit={guardar} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {!modoEdicion && (
            <input
              className="w-full border p-2 rounded"
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          <select
            className="w-full border p-2 rounded"
            value={claseId}
            onChange={(e) => setClaseId(e.target.value)}
            required
          >
            <option value="">Seleccionar Clase</option>
            {clases.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded"
            >
              {modoEdicion ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
