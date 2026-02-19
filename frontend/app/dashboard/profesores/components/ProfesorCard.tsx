//frontend/app/dashboard/profesores/components/ProfesorStats.tsx
export default function ProfesorCard({
  profesor,
  clases,
  onEdit,
  onDelete,
  onToggle,
}: any) {
  const claseAsignada = clases.find(
    (c: any) => c.id === profesor.clase_id
  );

  return (
    <div className="bg-[#f1ddbf] rounded-2xl p-6 shadow flex justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
            {profesor.nombre.charAt(0)}
          </div>

          <div>
            <p className="font-semibold text-lg">
              {profesor.nombre}
            </p>
            <p className="text-sm text-gray-600">
              {profesor.email}
            </p>
          </div>
        </div>

        <div className="text-sm">
          Clase:{" "}
          <span className="bg-blue-200 px-2 py-1 rounded-full">
            {claseAsignada?.nombre || "Sin clase"}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span>Activo</span>
          <input
            type="checkbox"
            checked={profesor.activo}
            onChange={onToggle}
            className="w-5 h-5"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onEdit}
          className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
        >
          Editar
        </button>

        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
