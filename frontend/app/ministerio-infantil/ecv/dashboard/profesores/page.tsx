//frontend/app/dashboard/profesores/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import toast, { Toaster } from "react-hot-toast";

import {
  ArrowLeft,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Pencil,
  Trash2,
  KeyRound,
  Power,
  X,
  Mail,
  Phone,
  BookOpen,
  LoaderCircle,
} from "lucide-react";

const API = "/ministerio-infantil/ecv/usuarios";
const DASHBOARD = "/ministerio-infantil/ecv/dashboard";

interface Profesor {
  id: number;
  nombre: string;
  apellido: string | null;
  email: string;
  telefono: string | null;
  activo: boolean;
  clase_id: number | null;
  clase_nombre: string | null;
  ultimo_acceso: string | null;
}

const formularioInicial = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  password: "",
};

export default function ProfesoresPage() {
  const usuario = useAuth();

  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [modal, setModal] = useState<
    "crear" | "editar" | "password" | null
  >(null);

  const [seleccionado, setSeleccionado] =
    useState<Profesor | null>(null);

  const [formulario, setFormulario] =
    useState(formularioInicial);

  const autorizado =
    usuario?.rol === "admin" ||
    usuario?.rol === "superadmin";

  const cargarProfesores = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const data = await apiFetch(API);

      if (!Array.isArray(data)) {
        throw new Error("Respuesta inesperada del servidor");
      }

      setProfesores(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar profesores"
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (autorizado) {
      cargarProfesores();
    }
  }, [autorizado, cargarProfesores]);

  function abrirCrear() {
    setSeleccionado(null);
    setFormulario({ ...formularioInicial });
    setModal("crear");
  }

  function abrirEditar(profesor: Profesor) {
    setSeleccionado(profesor);

    setFormulario({
      nombre: profesor.nombre,
      apellido: profesor.apellido || "",
      email: profesor.email,
      telefono: profesor.telefono || "",
      password: "",
    });

    setModal("editar");
  }

  function abrirPassword(profesor: Profesor) {
    setSeleccionado(profesor);
    setFormulario({ ...formularioInicial });
    setModal("password");
  }

  function cerrarModal() {
    if (guardando) return;

    setModal(null);
    setSeleccionado(null);
    setFormulario({ ...formularioInicial });
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();

    if (guardando) return;

    if (
      modal !== "editar" &&
      (
        formulario.password.length < 8 ||
        new TextEncoder().encode(formulario.password).length > 72
      )
    ) {
      toast.error("Usá una contraseña válida de al menos 8 caracteres");
      return;
    }

    setGuardando(true);

    try {
      if (modal === "password" && seleccionado) {
        await apiFetch(`${API}/${seleccionado.id}/password`, {
          method: "PUT",
          body: JSON.stringify({
            password: formulario.password,
          }),
        });

        toast.success("Contraseña restablecida");
      } else {
        const datos = {
          nombre: formulario.nombre.trim(),
          apellido: formulario.apellido.trim(),
          email: formulario.email.trim().toLowerCase(),
          telefono: formulario.telefono.trim(),
          clase_id: seleccionado?.clase_id ?? null,
        };

        if (modal === "editar" && seleccionado) {
          await apiFetch(`${API}/${seleccionado.id}`, {
            method: "PUT",
            body: JSON.stringify(datos),
          });

          toast.success("Profesor actualizado");
        } else if (modal === "crear") {
          await apiFetch(API, {
            method: "POST",
            body: JSON.stringify({
              ...datos,
              password: formulario.password,
            }),
          });

          toast.success("Profesor registrado");
        }
      }

      setModal(null);
      setSeleccionado(null);
      setFormulario({ ...formularioInicial });

      await cargarProfesores();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "No se pudieron guardar los cambios"
      );
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(profesor: Profesor) {
    if (guardando) return;

    const accion = profesor.activo
      ? "desactivar"
      : "activar";

    if (!confirm(`¿Querés ${accion} a ${profesor.nombre}?`)) {
      return;
    }

    setGuardando(true);

    try {
      await apiFetch(`${API}/${profesor.id}/toggle`, {
        method: "PUT",
      });

      toast.success("Estado actualizado");
      await cargarProfesores();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al cambiar estado"
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarProfesor(profesor: Profesor) {
    if (guardando) return;

    if (profesor.clase_id) {
      toast.error("Primero debés quitar la clase asignada");
      return;
    }

    if (!confirm(`¿Seguro que querés eliminar a ${profesor.nombre}?`)) {
      return;
    }

    setGuardando(true);

    try {
      await apiFetch(`${API}/${profesor.id}`, {
        method: "DELETE",
      });

      toast.success("Profesor eliminado");
      await cargarProfesores();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al eliminar profesor"
      );
    } finally {
      setGuardando(false);
    }
  }

  if (!usuario) return null;

  if (!autorizado) {
    return (
      <main className="min-h-screen p-8 text-center">
        <h1 className="text-xl font-bold">Acceso restringido</h1>
        <Link href={DASHBOARD} className="text-blue-700">
          Volver al panel
        </Link>
      </main>
    );
  }

  const activos = profesores.filter((p) => p.activo).length;
  const inactivos = profesores.length - activos;

  const profesoresFiltrados = profesores.filter((p) => {
    const texto = `${p.nombre} ${p.apellido || ""} ${p.email}`
      .toLowerCase();

    const coincide = texto.includes(
      busqueda.trim().toLowerCase()
    );

    const estado =
      filtro === "todos" ||
      (filtro === "activos" && p.activo) ||
      (filtro === "inactivos" && !p.activo);

    return coincide && estado;
  });

  const estadisticas = [
    {
      titulo: "Total profesores",
      valor: profesores.length,
      icono: Users,
      color: "bg-blue-100 text-blue-700",
    },
    {
      titulo: "Activos",
      valor: activos,
      icono: UserCheck,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      titulo: "Inactivos",
      valor: inactivos,
      icono: UserX,
      color: "bg-slate-200 text-slate-600",
    },
  ];

  const inputClass =
    "w-full border border-slate-300 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <Toaster position="top-center" />

      <header className="bg-[#142b48] text-white">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center gap-3">
          <img
            src="/logo-mm.jpg"
            alt="Ministerio Infantil"
            className="w-11 h-11 rounded-xl object-cover"
          />

          <div>
            <h1 className="font-bold">Ministerio Infantil</h1>
            <p className="text-xs text-blue-200">ECV 2027</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <Link
          href={DASHBOARD}
          className="inline-flex items-center gap-2 text-blue-700 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Volver al panel principal
        </Link>

        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Profesores
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Administración del equipo docente
            </p>
          </div>

          <button
            onClick={abrirCrear}
            disabled={guardando}
            className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-5 py-3 flex items-center justify-center gap-2 font-medium"
          >
            <UserPlus size={20} />
            Nuevo profesor
          </button>

        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {estadisticas.map((item) => {
            const Icono = item.icono;

            return (
              <div
                key={item.titulo}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <Icono size={25} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    {item.titulo}
                  </p>

                  <p className="text-2xl font-bold">
                    {cargando || error ? "-" : item.valor}
                  </p>
                </div>
              </div>
            );
          })}

        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">

          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              aria-label="Buscar profesores"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            aria-label="Filtrar por estado"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-3 bg-white"
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>

        </section>

        {cargando ? (
          <div className="flex justify-center items-center gap-2 py-12 text-slate-500">
            <LoaderCircle className="animate-spin" />
            Cargando profesores...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-center">
            <p>{error}</p>
            <button
              onClick={cargarProfesores}
              className="mt-3 underline"
            >
              Volver a intentar
            </button>
          </div>
        ) : profesoresFiltrados.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

            <Users size={42} className="mx-auto text-slate-300 mb-4" />

            <h3 className="font-semibold text-lg">
              No hay profesores para mostrar
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Registrá un profesor o modificá los filtros.
            </p>

          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {profesoresFiltrados.map((profesor) => (
              <article
                key={profesor.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4"
              >

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                    {profesor.nombre.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold break-words">
                      {profesor.nombre} {profesor.apellido}
                    </h3>

                    <span className={`inline-block text-xs rounded-full px-2 py-1 mt-1 ${
                      profesor.activo
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}>
                      {profesor.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                </div>

                <div className="space-y-3 text-sm text-slate-600">

                  <div className="flex items-center gap-2">
                    <Mail size={16} className="shrink-0" />
                    <span className="break-all">{profesor.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={16} className="shrink-0" />
                    {profesor.telefono || "Sin teléfono"}
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="shrink-0" />
                    {profesor.clase_nombre || "Sin clase asignada"}
                  </div>

                </div>

                <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-2">

                  <button
                    disabled={guardando}
                    onClick={() => abrirEditar(profesor)}
                    className="bg-blue-50 text-blue-700 rounded-lg p-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Pencil size={15} />
                    Editar
                  </button>

                  <button
                    disabled={guardando}
                    onClick={() => abrirPassword(profesor)}
                    className="bg-slate-100 text-slate-700 rounded-lg p-2 text-sm flex items-center justify-center gap-2"
                  >
                    <KeyRound size={15} />
                    Contraseña
                  </button>

                  <button
                    disabled={guardando}
                    onClick={() => cambiarEstado(profesor)}
                    className="bg-amber-50 text-amber-700 rounded-lg p-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Power size={15} />
                    {profesor.activo ? "Desactivar" : "Activar"}
                  </button>

                  <button
                    disabled={guardando}
                    onClick={() => eliminarProfesor(profesor)}
                    className="bg-red-50 text-red-700 rounded-lg p-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 size={15} />
                    Eliminar
                  </button>

                </div>

              </article>
            ))}

          </section>
        )}

      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">

          <form
            onSubmit={guardar}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal"
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5"
          >

            <div className="flex justify-between items-center gap-3">

              <h2 id="titulo-modal" className="text-xl font-bold">
                {modal === "crear"
                  ? "Nuevo profesor"
                  : modal === "editar"
                  ? "Editar profesor"
                  : "Restablecer contraseña"}
              </h2>

              <button
                type="button"
                aria-label="Cerrar"
                disabled={guardando}
                onClick={cerrarModal}
                className="text-slate-500"
              >
                <X size={24} />
              </button>

            </div>

            {modal !== "password" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <label className="text-sm font-medium">
                    Nombre *
                    <input
                      required
                      className={`${inputClass} mt-1`}
                      value={formulario.nombre}
                      onChange={(e) => setFormulario({
                        ...formulario,
                        nombre: e.target.value,
                      })}
                    />
                  </label>

                  <label className="text-sm font-medium">
                    Apellido
                    <input
                      className={`${inputClass} mt-1`}
                      value={formulario.apellido}
                      onChange={(e) => setFormulario({
                        ...formulario,
                        apellido: e.target.value,
                      })}
                    />
                  </label>

                </div>

                <label className="block text-sm font-medium">
                  Correo electrónico *
                  <input
                    type="email"
                    required
                    className={`${inputClass} mt-1`}
                    value={formulario.email}
                    onChange={(e) => setFormulario({
                      ...formulario,
                      email: e.target.value,
                    })}
                  />
                </label>

                <label className="block text-sm font-medium">
                  Teléfono
                  <input
                    type="tel"
                    className={`${inputClass} mt-1`}
                    value={formulario.telefono}
                    onChange={(e) => setFormulario({
                      ...formulario,
                      telefono: e.target.value,
                    })}
                  />
                </label>
              </>
            )}

            {modal === "password" && (
              <p className="text-sm text-slate-600">
                Nueva contraseña para {seleccionado?.nombre}.
              </p>
            )}

            {modal !== "editar" && (
              <label className="block text-sm font-medium">
                Contraseña *
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  className={`${inputClass} mt-1`}
                  value={formulario.password}
                  onChange={(e) => setFormulario({
                    ...formulario,
                    password: e.target.value,
                  })}
                />
              </label>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">

              <button
                type="button"
                disabled={guardando}
                onClick={cerrarModal}
                className="px-5 py-3 bg-slate-100 rounded-xl text-slate-700"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando}
                className="px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>

            </div>

          </form>

        </div>
      )}

    </main>
  );
}
