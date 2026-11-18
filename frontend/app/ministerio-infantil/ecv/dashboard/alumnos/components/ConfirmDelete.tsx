//frontend/app/dashboard/alumnos/components/ConfirmDelete.tsx
"use client";

type Props = {
  abierto: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
};

export default function ConfirmDelete({
  abierto,
  onCancelar,
  onConfirmar,
}: Props) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f7e7cf] rounded-2xl p-8 w-full max-w-md text-center shadow-xl">

        <h2 className="text-xl font-bold text-[#5b3a1d] mb-3">
          ¿Eliminar Estudiante?
        </h2>

        <p className="text-sm text-[#7a5434] mb-6">
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancelar}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirmar}
            className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
