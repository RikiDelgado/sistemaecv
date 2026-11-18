//frontend/app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { logout } from "@/lib/logout";

export default function DashboardPage() {
  const usuario = useAuth();
  const router = useRouter();

  if (!usuario) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e6c9a8] to-[#f3e6c9] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#f1ddbf] rounded-2xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-700 text-white flex items-center justify-center text-xl font-bold">
              {usuario.nombre.charAt(0)}
            </div>

            <div>
              <p className="text-sm text-gray-600">Â¡Bienvenido de nuevo!</p>
              <h1 className="text-xl font-bold">{usuario.nombre}</h1>
              <div className="flex gap-2 mt-1 text-xs">
                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  {usuario.rol}
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Colonia Cristiana de Vacaciones
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => logout(router)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Cerrar sesiÃ³n
          </button>
        </div>

        {/* GestiÃ³n */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            GestiÃ³n del Sistema
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profesores */}
            <Link
              href="/dashboard/profesores"
              className="bg-[#f1ddbf] rounded-xl p-5 shadow flex flex-col justify-between hover:scale-[1.02] transition"
            >
              <div>
                <div className="text-3xl mb-2">ðŸ‘©â€ðŸ«</div>
                <h3 className="font-semibold text-lg">Profesores</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Gestionar el personal docente y sus asignaciones
                </p>
              </div>
              <span className="mt-4 text-sm text-orange-700 font-medium">
                Abrir mÃ³dulo â†’
              </span>
            </Link>

            {/* Estudiantes */}
            <Link
              href="/dashboard/alumnos"
              className="bg-[#f1ddbf] rounded-xl p-5 shadow flex flex-col justify-between hover:scale-[1.02] transition"
            >
              <div>
                <div className="text-3xl mb-2">ðŸ‘¨â€ðŸŽ“</div>
                <h3 className="font-semibold text-lg">Estudiantes</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Administrar matrÃ­culas y expedientes acadÃ©micos
                </p>
              </div>
              <span className="mt-4 text-sm text-yellow-700 font-medium">
                Abrir mÃ³dulo â†’
              </span>
            </Link>

            {/* Asistencia */}
            <Link
              href="/dashboard/asistencias"
              className="bg-[#f1ddbf] rounded-xl p-5 shadow flex flex-col justify-between hover:scale-[1.02] transition"
            >
              <div>
                <div className="text-3xl mb-2">âœ…</div>
                <h3 className="font-semibold text-lg">Asistencia</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Control de asistencia y reportes de puntualidad
                </p>
              </div>
              <span className="mt-4 text-sm text-green-700 font-medium">
                Abrir mÃ³dulo â†’
              </span>
            </Link>

            {/* Finanzas */}
            <div className="bg-[#f1ddbf] rounded-xl p-5 shadow flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-2">ðŸ’°</div>
                <h3 className="font-semibold text-lg">Finanzas</h3>
                <p className="text-sm text-gray-600 mt-1">
                  GestiÃ³n de pagos, cobranzas y reportes
                </p>
              </div>
              <span className="mt-4 text-sm text-teal-700 font-medium">
                PrÃ³ximamente â†’
              </span>
            </div>

            {/* Clases */}
            <Link
              href="/dashboard/clases"
              className="bg-[#f1ddbf] rounded-xl p-5 shadow flex flex-col justify-between hover:scale-[1.02] transition"
            >
              <div>
                <div className="text-3xl mb-2">ðŸ“…</div>
                <h3 className="font-semibold text-lg">Clases</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Crear y gestionar clases y asignaciones docentes
                </p>
              </div>
              <span className="mt-4 text-sm text-blue-700 font-medium">
                Abrir mÃ³dulo â†’
              </span>
            </Link>


            {/* Mi Perfil + Calendario */}
            <div className="bg-[#f1ddbf] rounded-xl p-5 shadow flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-2">ðŸ‘¤</div>
                <h3 className="font-semibold text-lg">Mi Perfil + Calendario</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Actualizar informaciÃ³n personal y calendario acadÃ©mico
                </p>
              </div>
              <span className="mt-4 text-sm text-purple-700 font-medium">
                PrÃ³ximamente â†’
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

