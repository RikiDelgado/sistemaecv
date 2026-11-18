// frontend/app/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // 🔴 Si el backend devuelve HTML (404, 500, etc)
  const text = await response.text();

  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }

  // 🔐 Manejo centralizado de 401
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
    throw new Error("No autorizado");
  }

  if (!response.ok) {
    throw new Error(data?.error || "Error en la petición");
  }

  return data;
}
