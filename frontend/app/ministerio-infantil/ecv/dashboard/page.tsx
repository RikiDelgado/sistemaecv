//frontend/app/dashboard/page.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { logout } from "@/lib/logout";

import {
  Users,
  GraduationCap,
  ClipboardCheck,
  Wallet,
  BookOpen,
  UserCircle,
  LogOut,
  ArrowRight,
} from "lucide-react";

const base = "/ministerio-infantil/ecv/dashboard";

const modulos = [
  {
    titulo: "Profesores",
    descripcion: "Administrar docentes y sus asignaciones.",
    icono: Users,
    ruta: `${base}/profesores`,
    color: "bg-blue-100 text-blue-600",
    activo: true,
  },
  {
    titulo: "Estudiantes",
    descripcion: "Gestionar inscripciones y datos de estudiantes.",
    icono: GraduationCap,
    ruta: `${base}/alumnos`,
    color: "bg-indigo-100 text-indigo-600",
    activo: true,
  },
  {
    titulo: "Asistencia",
    descripcion: "Registrar y consultar la asistencia diaria.",
    icono: ClipboardCheck,
    ruta: `${base}/asistencias`,
    color: "bg-emerald-100 text-emerald-600",
    activo: true,
  },
  {
    titulo: "Finanzas",
    descripcion: "Administrar pagos, donaciones e ingresos.",
    icono: Wallet,
    ruta: `${base}/finanzas`,
    color: "bg-teal-100 text-teal-600",
    activo: false,
  },
  {
    titulo: "Clases",
    descripcion: "Organizar clases, estudiantes y docentes.",
    icono: BookOpen,
    ruta: `${base}/clases`,
    color: "bg-sky-100 text-sky-600",
    activo: true,
  },
  {
    titulo: "Mi perfil y calendario",
    descripcion: "Gestionar datos personales y actividades.",
    icono: UserCircle,
    ruta: `${base}/perfil`,
    color: "bg-purple-100 text-purple-600",
    activo: false,
  },
];

export default function DashboardPage() {
  const usuario = useAuth();
  const router = useRouter();

  if (!usuario) return null;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">

      <header className="bg-[#142b48] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-3">

          <div className="flex items-center gap-3">
            <img
              src="/logo-mm.jpg"
              alt="Ministerio Infantil"
              className="w-11 h-11 rounded-xl object-cover"
            />

            <div>
              <h1 className="font-bold text-sm sm:text-lg">
                Ministerio Infantil
              </h1>
              <p className="text-xs text-blue-200">
                ECV 2027
              </p>
            </div>
          </div>

          <button
            onClick={() => logout(router)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline text-sm">
              Cerrar sesión
            </span>
          </button>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        <section className="bg-gradient-to-r from-blue-100 to-sky-50 border border-blue-200 rounded-2xl p-5 sm:p-7">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 shrink-0 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl font-bold">
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm text-slate-600">
                Bienvenido de nuevo
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {usuario.nombre}
              </h2>

              <p className="text-xs sm:text-sm text-blue-700 mt-1">
                Escuela Cristiana de Vacaciones 2027
              </p>
            </div>

          </div>

        </section>

        <section>

          <div className="mb-5">
            <h2 className="text-xl font-bold">
              Gestión del sistema
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Seleccioná un módulo para continuar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {modulos.map((modulo) => {
              const Icono = modulo.icono;

              const contenido = (
                <>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${modulo.color}`}>
                    <Icono size={25} strokeWidth={1.8} />
                  </div>

                  <h3 className="text-lg font-semibold">
                    {modulo.titulo}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {modulo.descripcion}
                  </p>

                  <div className="mt-auto pt-6 flex justify-between items-center">
                    <span className={`text-sm font-semibold ${modulo.activo ? "text-blue-700" : "text-slate-400"}`}>
                      {modulo.activo
                        ? "Abrir módulo"
                        : "Próximamente"}
                    </span>

                    {modulo.activo && (
                      <ArrowRight size={18} className="text-blue-700" />
                    )}
                  </div>
                </>
              );

              return modulo.activo ? (
                <Link
                  key={modulo.titulo}
                  href={modulo.ruta}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-300 transition flex flex-col"
                >
                  {contenido}
                </Link>
              ) : (
                <div
                  key={modulo.titulo}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col"
                >
                  {contenido}
                </div>
              );
            })}

          </div>

        </section>

        <footer className="text-center text-xs text-slate-400 py-4">
          Ministerio Infantil | ECV 2027
        </footer>

      </div>
    </main>
  );
}
