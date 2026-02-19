//frontend/app/dashboard/alumnos/components/AlumnoModal.tsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  onGuardado: () => void;
  alumno?: any;
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
    dni: "",
    fecha_nacimiento: "",
    genero: "",
    direccion: "",
    talle_remera: "",
    tutor_nombre: "",
    tutor_apellido: "",
    tutor_telefono: "",
    alergia_medicamentos: false,
    detalle_alergia_medicamentos: "",
    alergia_alimentos: false,
    detalle_alergia_alimentos: "",
  });

  useEffect(() => {
    if (alumno) {
      setForm({
        ...alumno,
        fecha_nacimiento: alumno.fecha_nacimiento?.split("T")[0],
      });
    }
  }, [alumno]);

  if (!abierto) return null;

  function cambiar(e: any) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }
  function resetForm() {
  setForm({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    genero: "",
    direccion: "",
    talle_remera: "",
    tutor_nombre: "",
    tutor_apellido: "",
    tutor_telefono: "",
    alergia_medicamentos: false,
    detalle_alergia_medicamentos: "",
    alergia_alimentos: false,
    detalle_alergia_alimentos: "",
  });
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

    resetForm();
    onGuardado();
    onCerrar();
  }

  useEffect(() => {
  if (!abierto) {
    resetForm();
  }
}, [abierto]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f7e7cf] rounded-2xl w-full max-w-3xl p-8 overflow-y-auto max-h-[90vh] shadow-xl">

        <h2 className="text-2xl font-bold text-[#5b3a1d] mb-6">
          {alumno ? "Editar Estudiante" : "Agregar Estudiante"}
        </h2>

        <form onSubmit={guardar} className="space-y-6">

          {/* INFORMACIÓN PERSONAL */}
          <div>
            <h3 className="font-semibold text-[#5b3a1d] mb-3">
              🧍 Información Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nombre" value={form.nombre} onChange={cambiar}
                placeholder="Nombre *" required
                className="input-style" />

              <input name="apellido" value={form.apellido} onChange={cambiar}
                placeholder="Apellido *" required
                className="input-style" />

              <input name="dni" value={form.dni} onChange={cambiar}
                placeholder="DNI *" required
                className="input-style" />

              <input type="date" name="fecha_nacimiento"
                value={form.fecha_nacimiento}
                onChange={cambiar}
                required
                className="input-style" />

              <select name="genero" value={form.genero}
                onChange={cambiar}
                required
                className="input-style">
                <option value="">Seleccionar sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>

              <input name="talle_remera"
                value={form.talle_remera}
                onChange={cambiar}
                placeholder="Talle de remera"
                className="input-style" />

              <input name="direccion"
                value={form.direccion}
                onChange={cambiar}
                placeholder="Dirección (opcional)"
                className="input-style md:col-span-2" />
            </div>
          </div>

          {/* TUTOR */}
          <div>
            <h3 className="font-semibold text-[#5b3a1d] mb-3">
              👤 Información del Tutor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="tutor_nombre"
                value={form.tutor_nombre}
                onChange={cambiar}
                placeholder="Nombre del tutor *"
                required
                className="input-style" />

              <input name="tutor_apellido"
                value={form.tutor_apellido}
                onChange={cambiar}
                placeholder="Apellido del tutor *"
                required
                className="input-style" />

              <input name="tutor_telefono"
                value={form.tutor_telefono}
                onChange={cambiar}
                placeholder="Teléfono del tutor"
                className="input-style md:col-span-2" />
            </div>
          </div>

          {/* SALUD */}
          <div>
            <h3 className="font-semibold text-[#5b3a1d] mb-3">
              🏥 Información de Salud
            </h3>

            <div className="space-y-4">

              {/* Alergia Medicamentos */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="alergia_medicamentos"
                    checked={form.alergia_medicamentos}
                    onChange={cambiar}
                  />
                  ¿Alergia a medicamentos?
                </label>

                {form.alergia_medicamentos && (
                  <input
                    name="detalle_alergia_medicamentos"
                    value={form.detalle_alergia_medicamentos}
                    onChange={cambiar}
                    placeholder="¿Cuál?"
                    className="input-style mt-2"
                  />
                )}
              </div>

              {/* Alergia Alimentos */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="alergia_alimentos"
                    checked={form.alergia_alimentos}
                    onChange={cambiar}
                  />
                  ¿Alergia a alimentos?
                </label>

                {form.alergia_alimentos && (
                  <input
                    name="detalle_alergia_alimentos"
                    value={form.detalle_alergia_alimentos}
                    onChange={cambiar}
                    placeholder="¿Cuál?"
                    className="input-style mt-2"
                  />
                )}
              </div>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#c98b1f] text-white hover:bg-[#b57b1b]"
            >
              Guardar Estudiante
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input-style {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #d2b48c;
          outline: none;
          background: white;
        }
      `}</style>
    </div>
  );
}
