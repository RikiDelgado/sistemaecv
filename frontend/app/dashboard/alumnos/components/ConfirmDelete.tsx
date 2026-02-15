//frontend/app/dashboard/alumnos/components/AlumnoModal.tsx
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
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
        <h2 className="text-lg font-bold mb-2">¿Eliminar Estudiante?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-center gap-3">
          <button onClick={onCancelar} className="px-4 py-2 rounded bg-gray-200">
            Cancelar
          </button>
          <button onClick={onConfirmar} className="px-4 py-2 rounded bg-red-600 text-white">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
