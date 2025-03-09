import { useState, useEffect } from "react";
import { Field } from "@/app/Interface/field";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { Dialog } from "@/components/ui/dialog"; // Usamos Dialog de shadcn
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {API_URL} from "../../../config";

interface FieldProps {
    FieldItems: Field[];
}

export function PublishedList({ FieldItems }: FieldProps) {
  const [items, setItems] = useState<Field[]>(FieldItems);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Field | null>(null);

  useEffect(() => {
    setItems(FieldItems);
  }, [FieldItems]);

  const handleStatusToggle = async (id: string | undefined) => {
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/field/updateStatus/${id}`, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Error al actualizar el estado");

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, status: !item.status } : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const handleEdit = (item: Field) => {
    setEditItem(item); // Establecer el ítem a editar
    setShowModal(true); // Mostrar el modal de edición
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return; 

    fetch(`${API_URL}/field/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setItems(items.filter((item) => item.id !== id)); // Eliminar el anuncio de la lista
        } else {
          console.error("Error al eliminar el anuncio");
        }
      })
      .catch((error) => console.error("Error al realizar la solicitud DELETE:", error));
  };

 

  const handleSubmit = (updatedItem: Field) => {
    fetch(`${API_URL}/field/${updatedItem.id}`, {
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
      <h2 className="text-base sm:text-lg font-semibold mb-4">Editar cancha</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editItem) {
            handleSubmit(editItem);
          }
        }}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">Nombre de la cancha</label>
          <input
            type="text"
            id="name"
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
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
              <th className="px-4 py-2 border-b">Cancha</th>
              <th className="px-4 py-2 border-b">Descripción</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Acción</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {items.map((item) => (
              <tr key={`${item.id}-${item.name}`} className="hover:bg-gray-50">
               <td className="px-4 py-2 border-b text-center flex items-center space-x-2">
                    {item.image ? (
                        <Image
                        src={`https://api.dev.phaqchas.com/public${item.image}`}
                        alt={item.name || "Imagen del anuncio"}
                        width={50}
                        height={30}
                        priority
                        />
                    ) : (
                        <span>No image</span>
                    )}
                    <span>{item.name}</span>
                    </td>

                <td className="px-4 py-2 border-b text-center">{item.description}</td>
                <td className="px-4 py-2 border-b text-center">
                  <Button
                    className={`px-4 py-2 rounded text-white ${item.status ? "bg-green-400" : "bg-gray-400"}`}
                    onClick={() => handleStatusToggle(item.id)}
                  >
                    {item.status ? "Activo" : "Inactivo"}
                  </Button>
                </td>
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
