//frontend/app/lib/logout.ts
"use client";

import { useRouter } from "next/navigation";

export function logout(router: ReturnType<typeof useRouter>) {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  router.push("/login");
}
