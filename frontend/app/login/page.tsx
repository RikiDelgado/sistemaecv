//frontend/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  LoaderCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("rememberEmail");

    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Completá todos los campos");
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify(data.usuario)
      );

      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      toast.success("Bienvenido al sistema");
      router.push("/dashboard");

    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#142b48] via-blue-900 to-sky-700 flex items-center justify-center p-5">

      <Toaster position="top-center" />

      <div className="w-full max-w-md">

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-7 sm:p-10 space-y-6 text-slate-800"
        >

          <div className="text-center">

            <img
              src="/logo-mm.jpg"
              alt="Ministerio Infantil"
              className="mx-auto w-20 h-20 rounded-2xl object-cover mb-5"
            />

            <h1 className="text-2xl font-bold text-slate-900">
              Sistema de Gestión
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Ministerio Infantil
            </p>

          </div>

          <div className="border-t border-slate-100" />

          <div>

            <label
              htmlFor="email"
              className="text-sm font-medium block mb-2"
            >
              Correo electrónico
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                placeholder="correo@ejemplo.com"
                className="w-full border border-slate-300 rounded-xl pl-10 pr-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

          </div>

          <div>

            <label
              htmlFor="password"
              className="text-sm font-medium block mb-2"
            >
              Contraseña
            </label>

            <div className="relative">

              <LockKeyhole
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Ingresá tu contraseña"
                className="w-full border border-slate-300 rounded-xl pl-10 pr-11 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-3.5 text-slate-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              className="accent-blue-700 w-4 h-4"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Recordar mi correo
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white rounded-xl py-3 font-semibold transition flex justify-center items-center gap-2"
          >
            {loading && (
              <LoaderCircle size={18} className="animate-spin" />
            )}

            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <div className="text-center border-t border-slate-100 pt-5">
            <p className="text-xs text-slate-500 italic">
              Jehová es mi pastor; nada me faltará.
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Salmos 23:1
            </p>
          </div>

        </form>

        <p className="text-center text-xs text-blue-100 mt-6">
          Sistema de Gestión | Ministerio Infantil
        </p>

      </div>

    </main>
  );
}
