//frontend/app/dashboard/clases/components/ClaseCard.tsx
import { apiFetch } from "../../../lib/api";

export default function ClaseCard({
  clase,
  alumnos,
  onEditar,
  onEliminar,
}: any) {
  const cantidad = alumnos.filter(
    (a: any) => a.clase_id === clase.id
  ).length;

  const porcentaje = Math.round(
    (cantidad / clase.capacidad_maxima) * 100
  );

  async function eliminar() {
    if (!confirm("¿Eliminar clase?")) return;

    await apiFetch(`/clases/${clase.id}`, {
      method: "DELETE",
    });

    onEliminar();
  }

  return (
    <div className="bg-[#EED9C4] p-6 rounded-2xl shadow">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#4B2E1E]">
            {clase.nombre}
          </h2>
          <p className="text-sm text-[#6B3E26]">
            Profesora: {clase.docente_nombre || "Sin asignar"}
          </p>
          <p className="text-sm">
            Capacidad: {clase.capacidad_maxima}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onEditar}
            className="bg-[#0F8B8D] text-white px-4 py-1 rounded-lg"
          >
            Editar
          </button>

          <button
            onClick={eliminar}
            className="bg-red-500 text-white px-4 py-1 rounded-lg"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 bg-gray-300 rounded">
          <div
            className="h-2 bg-[#0F8B8D] rounded"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        <p className="text-xs mt-1 text-[#6B3E26]">
          {cantidad} estudiantes — {porcentaje}% ocupado
        </p>
      </div>
    </div>
  );
}
