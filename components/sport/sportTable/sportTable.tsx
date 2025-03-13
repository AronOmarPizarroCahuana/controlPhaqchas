import { useState, useEffect } from "react";
import { Sport } from "@/app/Interface/sport";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { Dialog } from "@/components/ui/dialog"; // Usamos Dialog de shadcn
import Image from "next/image";
import {API_URL} from "../../../config";
import {API_URL_BASE} from "../../../config";

interface PublishedListProps {
  publishedItems: Sport[];
}

export function PublishedList({ publishedItems }: PublishedListProps) {
  const [items, setItems] = useState<Sport[]>(publishedItems);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Sport | null>(null);

  useEffect(() => {
    setItems(publishedItems);
  }, [publishedItems]);

 

  const handleEdit = (item: Sport) => {
    setEditItem(item); // Establecer el ítem a editar
    setShowModal(true); // Mostrar el modal de edición
  };

  const handleDelete = (id: number | undefined) => {
    if (!id) return; 

    fetch(`${API_URL}/sport/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setItems(items.filter((item) => item.id !== id));
        } else {
          console.error("Error al eliminar el deporte");
        }
      })
      .catch((error) => console.error("Error al realizar la solicitud DELETE:", error));
  };

  

  const handleSubmit = (updatedItem: Sport) => {
    fetch(`${API_URL}/sport/${updatedItem.id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => {
        if (response.ok) {
          setItems(
            items.map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            )
          );
          setShowModal(false); // Cerrar el modal después de actualizar
        } else {
          console.error("Error al actualizar el anuncio");
        }
      })
      .catch((error) => console.error("Error al realizar la solicitud PUT:", error));
  };

  return (
    <>
      {showModal && editItem && (
  <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
    <div className="p-4 sm:p-6 px-4 sm:px-6 bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-md md:max-w-sm lg:max-w-md xl:max-w-lg ml-5 mr-5">
      <h2 className="text-base sm:text-lg font-semibold mb-4">Editar deporte</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editItem) {
            handleSubmit(editItem);
          }
        }}
      >
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            id="title"
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
        <div className="flex space-x-4 ">
        <div className="w-full">
  <label className="block text-xs sm:text-sm md:text-base font-medium">Precio día</label>
  <input
    type="number"
    name="price_morning"
    id="price_morning"
    value={editItem.price_morning}
    onChange={(e) => setEditItem({ ...editItem, price_morning: parseFloat(e.target.value) })}
    className="w-full p-2 border border-gray-300 rounded text-xs sm:text-sm md:text-base min-h-[0px] sm:min-h-[48px] md:min-h-[56px]"
    placeholder="Escribe el precio del día"
    required
  />
</div>

  <div className="w-full">
    <label className="block text-xs sm:text-sm md:text-base font-medium">Precio noche</label>
    <input
      type="number"
      name="price_evening"
      id="price_evening"
            value={editItem.price_evening}
            onChange={(e) => setEditItem({ ...editItem, price_evening: parseFloat(e.target.value) })}
      className="w-full  p-2 border border-gray-300 rounded text-xs sm:text-sm md:text-base min-h-[0px] sm:min-h-[48px] md:min-h-[56px]"
      placeholder="Escribe el precio de la noche"
      required
    />
  </div>
</div>
        <div className="mb-4 h-36">
          <label htmlFor="description" className="block text-sm font-medium">Descripción</label>
          <textarea
            id="description"
            value={editItem.description}
            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
            className="w-full h-full mt-1 p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
        <div className="flex justify-between py-3">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</Dialog>


  
   
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-2 border-b">Imagen</th>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Precio día</th>
              <th className="px-4 py-2 border-b">Precio noche</th>
              <th className="px-4 py-2 border-b">Descripción</th>
              <th className="px-4 py-2 border-b">Acción</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {items.map((item) => (
              <tr key={`${item.id}-${item.name}`} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-center">
                  {item.image ? (
                    <Image
                      src={`${API_URL_BASE}/${item.image}`}
                      alt={item.name || "Imagen del anuncio"}
                      width={50}
                      height={30}
                      priority
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>

                <td className="px-4 py-2 border-b text-center">{item.name}</td>
                <td className="px-4 py-2 border-b text-center">{item.price_morning}</td>
                <td className="px-4 py-2 border-b text-center">{item.price_evening}</td>
                <td className="px-4 py-2 border-b text-center">{item.description}</td>

                <td className="px-4 py-2 border-b text-center">
                  <button onClick={() => handleEdit(item)} title="Editar">
                    <FaEdit className="text-blue-500 hover:text-blue-700" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} title="Eliminar" className="ml-2">
                    <FaTrashAlt className="text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
