//frontend/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
      toast.error("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      toast.success("Bienvenido ðŸ™Œ");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Error al iniciar sesiÃ³n");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`min-h-screen flex items-center justify-center transition ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-black"
          : "bg-gradient-to-br from-yellow-200 via-orange-200 to-amber-300"
      }`}
    >
      <Toaster />

      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className={`p-8 rounded-2xl shadow-2xl space-y-5 border backdrop-blur-md ${
            darkMode ? "bg-gray-800 text-white" : "bg-white/80"
          }`}
        >
          {/* ðŸŒ™ Toggle Dark Mode */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="text-sm"
            >
              {darkMode ? "â˜€ï¸" : "ðŸŒ™"}
            </button>
          </div>

          {/* ðŸœï¸ LOGO */}
          <div className="text-center">
            <img
              src="/logo-mm.jpg"
              alt="Ministerio"
              className="mx-auto w-16 mb-2"
            />
            <h1 className="text-2xl font-bold">
              Sistema de GestiÃ³n
            </h1>
            
            <p className="text-sm opacity-70">
              Ministerio Infantil
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm">Correo</label>
            <input
              type="email"
              placeholder="correo@email.com"
              className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm">ContraseÃ±a</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-sm"
              >
                {showPassword ? "ðŸ‘ï¸" : "ðŸ™ˆ"}
              </button>
            </div>
          </div>

          {/* RECORDARME */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <span>Recordarme</span>
          </div>

          {/* BOTÃ“N */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg font-semibold transition"
          >
            {loading ? "Entrando..." : "Ingresar"}
          </button>

          {/* FOOTER */}
          <p className="text-xs text-center opacity-70">
            "JehovÃ¡ es mi pastor; nada me faltarÃ¡" ðŸœï¸
          </p>
        </form>
      </div>
    </main>
  );
}
