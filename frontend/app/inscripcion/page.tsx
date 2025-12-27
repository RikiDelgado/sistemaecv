//frontend/app/inscripcion/page.tsx
"use client";

import { useState } from "react";

export default function InscripcionECV() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    genero: "",
    direccion: "",
    tutor_nombre: "",
    tutor_apellido: "",
    tutor_telefono: "",
    alergia_medicamento: false,
    alergia_medicamento_detalle: "",
    alergia_alimento: false,
    alergia_alimento_detalle: "",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/alumnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("✅ Inscripción realizada con éxito");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-sand">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-6">
        
        {/* HEADER */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-oasis">
            Escuela Cristiana de Vacaciones 2026
          </h1>
          <p className="text-lg text-sunset mt-2">
            🌵 Completá este formulario para inscribir a tu hijo/a 🌵
          </p>
        </header>

        {/* IMAGEN DEL EVENTO */}
        <div className="mb-8">
          <img
            src="/aventuras-desierto.jpg"
            alt="Aventuras en el Desierto"
            className="w-full max-h-64 object-cover rounded-xl shadow-md"
          />
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* DATOS DEL ALUMNO */}
          <section>
            <h2 className="font-semibold text-oasis mb-2">
              Datos del niño/a
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input" name="nombre" placeholder="Nombre" onChange={handleChange} />
              <input className="input" name="apellido" placeholder="Apellido" onChange={handleChange} />
              <input className="input" name="dni" placeholder="DNI" onChange={handleChange} />
              <input className="input" type="date" name="fecha_nacimiento" onChange={handleChange} />
              <input className="input" name="genero" placeholder="Género" onChange={handleChange} />
              <input className="input" name="direccion" placeholder="Dirección (opcional)" onChange={handleChange} />
            </div>
          </section>

          {/* TUTOR */}
          <section>
            <h2 className="font-semibold text-oasis mb-2">
              Información del tutor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input" name="tutor_nombre" placeholder="Nombre" onChange={handleChange} />
              <input className="input" name="tutor_apellido" placeholder="Apellido" onChange={handleChange} />
              <input className="input md:col-span-2" name="tutor_telefono" placeholder="Teléfono" onChange={handleChange} />
            </div>
          </section>

          {/* SALUD */}
          <section>
            <h2 className="font-semibold text-oasis mb-2">
              Información de salud <span className="text-sm text-gray-500">(solo marcar si corresponde)</span>
            </h2>

            <div className="space-y-2">
              <label className="flex gap-2 items-center">
                <input type="checkbox" name="alergia_medicamento" onChange={handleChange} />
                ¿Alergia a medicamentos?
              </label>
              {form.alergia_medicamento && (
                <input
                  className="input"
                  name="alergia_medicamento_detalle"
                  placeholder="¿Cuál?"
                  onChange={handleChange}
                />
              )}

              <label className="flex gap-2 items-center">
                <input type="checkbox" name="alergia_alimento" onChange={handleChange} />
                ¿Alergia a alimentos?
              </label>
              {form.alergia_alimento && (
                <input
                  className="input"
                  name="alergia_alimento_detalle"
                  placeholder="¿Cuál?"
                  onChange={handleChange}
                />
              )}
            </div>
          </section>

          <button
            type="submit"
            className="w-full bg-oasis text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Inscribir
          </button>
        </form>
      </div>
    </main>
  );
}
