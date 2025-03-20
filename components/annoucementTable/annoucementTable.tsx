import { useState, useEffect } from "react";
import { PublishedItem } from "@/app/Interface/annoucement";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { Dialog } from "@/components/ui/dialog"; // Usamos Dialog de shadcn
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {API_URL} from "../../config";
import { Label } from "@/components/ui/label";
import {API_URL_BASE} from "../../config";

interface PublishedListProps {
  publishedItems: PublishedItem[];
}
interface AnnouncementFormProps {
  reloadAnnouncements: () => void; // Cambiar addPublishedItem por reloadAnnouncements
}


export function PublishedList({ publishedItems, reloadAnnouncements }: PublishedListProps & AnnouncementFormProps) {
  //const [items, setItems] = useState<PublishedItem[]>(publishedItems);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<PublishedItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<PublishedItem | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

 

  // 🖼️ Abrir el modal al hacer clic en la imagen
  const handleImageClick = (item: PublishedItem) => {
    setSelectedItem(item);
    setPreview(`${API_URL_BASE}/${item.image}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setSelectedItem(null);
    setNewImage(null);
    setPreview(null);
  };

  // ✅ Guardar imagen
  const handleSave = async () => {
    if (!selectedItem || !newImage) return;
  
    const formData = new FormData();
    formData.append("image", newImage);
  
    try {
      const response = await fetch(`${API_URL}/announcement/updateImage/${selectedItem.id}`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Error al actualizar la imagen");
  
      // Recargar la tabla de anuncios
      reloadAnnouncements(); // Llamar a la función que recarga la tabla de anuncios
  
      // Limpiar los datos del formulario
      setSelectedItem(null);
      setNewImage(null);
      setPreview(null);
  
      alert("Imagen actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
      
      alert("Ocurrió un error al actualizar la imagen.");
    }
  };
  





  const handleEdit = (item: PublishedItem) => {
    setEditItem(item); // Establecer el ítem a editar
    setShowModal(true); // Mostrar el modal de edición
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return; 
  
    fetch(`${API_URL}/announcement/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Eliminación exitosa", response);
          reloadAnnouncements(); // 🔄 Recargar la tabla con los datos actualizados
        } else {
          console.error("Error al eliminar el anuncio");
        }
      })
      .catch((error) => console.error("Error al realizar la solicitud DELETE:", error));
  };
  
  const handleStatusToggle = async (id: string | undefined) => {
    if (!id) return;
  
    try {
      const response = await fetch(`${API_URL}/announcement/updateStatus/${id}`, {
        method: "GET",
      });
  
      if (!response.ok) throw new Error("Error al actualizar el estado");
  
      console.log("Estado actualizado con éxito");
      reloadAnnouncements(); // 🔄 Recargar la lista desde la API
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };
  

  const handleSubmit = (updatedItem: PublishedItem) => {
    fetch(`${API_URL}/announcement/${updatedItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: updatedItem.title,
        description: updatedItem.description,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Actualización exitosa", response);
          reloadAnnouncements(); // 🔄 Recargar la tabla con los datos actualizados
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
      <h2 className="text-base sm:text-lg font-semibold mb-4">Editar Anuncio</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
            handleSubmit(editItem);
        }}
      >
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium">Título</label>
          <input
            type="text"
            id="title"
            value={editItem.title}
            onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
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
            className="bg-[#E1BC00] text-white py-2 px-4 rounded-md hover:bg-[#695e1f] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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

      <div className="">
        <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-2 border-b">Imagen</th>
              <th className="px-4 py-2 border-b">Título</th>
              <th className="px-4 py-2 border-b">Descripción</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Acción</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {publishedItems.map((item) => (
              <tr key={`${item.id}-${item.title}`} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-center" onClick={() => handleImageClick(item)}>
                  {item.image ? (
                    <Image
                      src={`${API_URL_BASE}/${item.image}`}
                      alt={item.title || "Imagen del anuncio"}
                      width={50}
                      height={30}
                      priority
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>

                <td className="px-4 py-2 border-b text-center">{item.title}</td>
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


{/* Modal para editar imagen */}
{selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center  justify-center z-50">
          <div className="bg-white p-6 rounded-lg  shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">Editar Imagen</h2>

            <Label className="block text-sm font-medium mb-2">Subir Imagen</Label>
            <div
              className="w-full h-40 p-4 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-gray-100"
              onClick={() => document.getElementById("fileInput2")?.click()}
            >
              <input
                id="fileInput2"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview ? (
                <Image src={preview} alt="Preview" width={80} height={80} className="rounded" />
              ) : (
                <p className="text-gray-500">Haz clic para subir una imagen</p>
              )}
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!newImage}>Aceptar</Button>
            </div>
          </div>
        </div>
      )}
   

      </div>
    </>
  );
}
