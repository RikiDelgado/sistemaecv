"use client";

import { useState } from "react";

export default function Inscripcion() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    tutor_nombre: "",
    tutor_telefono: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMensaje("");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/alumnos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setMensaje(data.error || "Error al inscribir");
      return;
    }

    setMensaje("Inscripción realizada correctamente");

    setForm({
      nombre: "",
      apellido: "",
      dni: "",
      fecha_nacimiento: "",
      tutor_nombre: "",
      tutor_telefono: "",
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md space-y-3"
      >
        <h2 className="text-xl font-bold text-center">
          Inscripción de Alumno
        </h2>

        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <label className="text-sm font-semibold">
          Fecha de nacimiento
        </label>

        <input
          type="date"
          name="fecha_nacimiento"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="tutor_nombre"
          placeholder="Nombre del tutor"
          value={form.tutor_nombre}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="tutor_telefono"
          placeholder="Teléfono del tutor"
          value={form.tutor_telefono}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Inscribir
        </button>

        {mensaje && (
          <p className="text-center text-sm mt-2">{mensaje}</p>
        )}
      </form>
    </main>
  );
}
