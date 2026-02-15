//frontend/app/dashboard/alumnos/components/AlumnoModal.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  onGuardado: () => void;
  alumno?: any; // si viene → editar
};

export default function AlumnoModal({
  abierto,
  onCerrar,
  onGuardado,
  alumno,
}: Props) {
  const [form, setForm] = useState<any>({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    genero: "",
    talle_remera: "",
    tutor_nombre: "",
    tutor_apellido: "",
    tutor_telefono: "",
    direccion: "",
  });

  useEffect(() => {
    if (alumno) {
      setForm({
        ...alumno,
        fecha_nacimiento: alumno.fecha_nacimiento.split("T")[0],
      });
    }
  }, [alumno]);

  if (!abierto) return null;

  function cambiar(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar(e: any) {
    e.preventDefault();

    if (alumno) {
      await apiFetch(`/alumnos/${alumno.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await apiFetch("/alumnos", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    onGuardado();
    onCerrar();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">
          {alumno ? "Editar Estudiante" : "Agregar Estudiante"}
        </h2>

        <form onSubmit={guardar} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="nombre" value={form.nombre} onChange={cambiar} placeholder="Nombre" required className="input" />
            <input name="apellido" value={form.apellido} onChange={cambiar} placeholder="Apellido" required className="input" />
            <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={cambiar} required className="input" />
            <select name="genero" value={form.genero} onChange={cambiar} required className="input">
              <option value="">Sexo</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <input name="talle_remera" value={form.talle_remera} onChange={cambiar} placeholder="Talle remera" className="input" />
          </div>

          <h3 className="font-semibold mt-4">Tutor</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="tutor_nombre" value={form.tutor_nombre} onChange={cambiar} placeholder="Nombre tutor" required className="input" />
            <input name="tutor_apellido" value={form.tutor_apellido} onChange={cambiar} placeholder="Apellido tutor" required className="input" />
            <input name="tutor_telefono" value={form.tutor_telefono} onChange={cambiar} placeholder="Teléfono" className="input" />
            <input name="direccion" value={form.direccion} onChange={cambiar} placeholder="Dirección" className="input" />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onCerrar} className="px-4 py-2 rounded bg-gray-200">
              Cancelar
            </button>
            <button className="px-4 py-2 rounded bg-[#c98b1f] text-white">
              Guardar Estudiante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
