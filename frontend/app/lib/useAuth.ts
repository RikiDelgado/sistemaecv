// frontend/app/lib/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("usuario");

    if (!token || !user) {
      router.push("/login");
      return;
    }

    setUsuario(JSON.parse(user));
  }, [router]);

  return usuario;
}
