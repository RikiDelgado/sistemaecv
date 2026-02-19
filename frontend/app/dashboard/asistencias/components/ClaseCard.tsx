//frontend/app/dashboard/asistencias/components/ClaseCard.tsx
"use client";

export default function ClaseCard({
  clase,
  onClick,
}: any) {
  return (
    <div
      onClick={() => onClick(clase)}
      className="bg-[#F3E3C8] p-4 rounded-xl cursor-pointer hover:shadow transition"
    >
      <h2 className="text-xl font-bold text-[#6B3E26]">
        {clase.nombre}
      </h2>

      <p className="text-sm text-[#8B5E3C]">
        👤 Prof. {clase.profesor_nombre ?? "—"}
      </p>
    </div>
  );
}
