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
    talle_remera: "", // 🆕 NUEVO
    tutor_nombre: "",
    tutor_apellido: "",
    tutor_telefono: "",
    alergia_medicamento: false,
    alergia_medicamento_detalle: "",
    alergia_alimento: false,
    alergia_alimento_detalle: "",
  });

  const [fecha, setFecha] = useState({
    dia: "",
    mes: "",
    anio: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFechaChange = (e: any) => {
    const { name, value } = e.target;
    setFecha({ ...fecha, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) return;

    const fechaNacimiento =
      fecha.anio && fecha.mes && fecha.dia
        ? `${fecha.anio}-${fecha.mes.padStart(2, "0")}-${fecha.dia.padStart(2, "0")}`
        : "";

    setLoading(true);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/alumnos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            fecha_nacimiento: fechaNacimiento,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al inscribir alumno");
        return;
      }

      alert(
        "💚 ¡Inscripción realizada con éxito!\n\n" +
          "Gracias por inscribir a tu hijo/a en la Escuela Cristiana de Vacaciones 2026.\n\n" +
          "Nos estaremos comunicando pronto con más información.\n" +
          "¡Que Dios los bendiga! 🙏"
      );

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
        alergia_medicamento: false,
        alergia_medicamento_detalle: "",
        alergia_alimento: false,
        alergia_alimento_detalle: "",
      });

      setFecha({ dia: "", mes: "", anio: "" });
    } catch {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-sand">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-6">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-oasis">
            Escuela Cristiana de Vacaciones 2026
          </h1>
          <p className="text-lg text-sunset mt-2">
            🌵 Completá este formulario para inscribir a tu hijo/a 🌵
          </p>
        </header>

        <div className="mb-8">
          <img
            src="/aventuras-desierto.jpg"
            alt="Aventuras en el Desierto"
            className="w-full max-h-64 object-cover rounded-xl shadow-md"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section>
            <h2 className="font-semibold text-oasis mb-2">
              Datos del niño/a
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
              <input className="input" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
              <input className="input" name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} />

              {/* FECHA DE NACIMIENTO */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">
                  Fecha de nacimiento
                </label>
                <div className="flex gap-2">
                  <input className="input w-1/3" name="dia" placeholder="Día" value={fecha.dia} onChange={handleFechaChange} />
                  <input className="input w-1/3" name="mes" placeholder="Mes" value={fecha.mes} onChange={handleFechaChange} />
                  <input className="input w-1/3" name="anio" placeholder="Año" value={fecha.anio} onChange={handleFechaChange} />
                </div>
              </div>

              {/* SEXO */}
              <select
                className="input"
                name="genero"
                value={form.genero}
                onChange={handleChange}
              >
                <option value="">Seleccionar sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>

              <input
                className="input"
                name="direccion"
                placeholder="Dirección (opcional)"
                value={form.direccion}
                onChange={handleChange}
              />

              {/* 🆕 TALLE DE REMERA */}
              <input
                className="input md:col-span-2"
                name="talle_remera"
                placeholder="Talle de remera (ej: 6, 8, S, M, L)"
                value={form.talle_remera}
                onChange={handleChange}
              />
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-oasis mb-2">
              Información del tutor
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input" name="tutor_nombre" placeholder="Nombre" value={form.tutor_nombre} onChange={handleChange} />
              <input className="input" name="tutor_apellido" placeholder="Apellido" value={form.tutor_apellido} onChange={handleChange} />
              <input className="input md:col-span-2" name="tutor_telefono" placeholder="Teléfono" value={form.tutor_telefono} onChange={handleChange} />
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-oasis mb-2">
              Información de salud <span className="text-sm text-gray-500">(solo marcar si corresponde)</span>
            </h2>

            <div className="space-y-2">
              <label className="flex gap-2 items-center">
                <input type="checkbox" name="alergia_medicamento" checked={form.alergia_medicamento} onChange={handleChange} />
                ¿Alergia a medicamentos?
              </label>

              {form.alergia_medicamento && (
                <input
                  className="input"
                  name="alergia_medicamento_detalle"
                  placeholder="¿Cuál?"
                  value={form.alergia_medicamento_detalle}
                  onChange={handleChange}
                />
              )}

              <label className="flex gap-2 items-center">
                <input type="checkbox" name="alergia_alimento" checked={form.alergia_alimento} onChange={handleChange} />
                ¿Alergia a alimentos?
              </label>

              {form.alergia_alimento && (
                <input
                  className="input"
                  name="alergia_alimento_detalle"
                  placeholder="¿Cuál?"
                  value={form.alergia_alimento_detalle}
                  onChange={handleChange}
                />
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-oasis text-white hover:bg-green-700"
            }`}
          >
            {loading ? "Inscribiendo..." : "Inscribir"}
          </button>
        </form>
      </div>
    </main>
  );
}
