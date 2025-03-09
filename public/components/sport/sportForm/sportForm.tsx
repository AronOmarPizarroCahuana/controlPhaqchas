import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sport } from "@/app/Interface/sport";
import Image from "next/image";
import {API_URL} from "../../../config";
interface AnnouncementFormProps {
  reloadAnnouncements: () => void; // Cambiar addPublishedItem por reloadAnnouncements
}

export function AnnouncementForm({ reloadAnnouncements }: AnnouncementFormProps) {
  const [formData, setFormData] = useState<Sport>({
    name: "",
    description: "",
    price_morning: 0,
    price_evening: 0,
    image: null,
  });
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Crear un objeto FormData para enviar los datos, incluyendo el archivo de imagen
    const data = new FormData();
    data.append("name", formData.name);
    if(formData.description!= null){
        data.append("description", formData.description);
    }
    data.append("price_morning", formData.price_morning.toString());  // Asegúrate de que sea un string
    data.append("price_evening", formData.price_evening.toString());  // Asegúrate de que sea un string
  
    // Si hay imagen, la agregamos al FormData
    if (formData.image) {
        data.append("image", formData.image);
    }
  
    try {
      const response = await fetch(`${API_URL}/sport`, {
        method: "POST",
        body: data,  // Enviamos el FormData
      });
  
      if (response.ok) {
        const result = await response.json();
        const imageUrl = result.image_url;
  
        // Recargar anuncios después de publicar
        reloadAnnouncements();
  
        console.log("Anuncio enviado:", { ...formData, id: result.id, imageUrl });
  
        // Limpiar el formulario
        setFormData({ name: "", description: "", price_morning: 0, price_evening: 0, image: null });
        setUploadedImageUrl(imageUrl);
        alert("Anuncio publicado con éxito.");
      } else {
        const errorResponse = await response.json();  // Obtener el mensaje de error detallado
        console.error("Detalles del error:", errorResponse);
        throw new Error("Error al publicar el anuncio: " + errorResponse.message || "Sin detalles.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error al intentar publicar el anuncio.");
    }
  };
  
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    // Convertir el valor a número si el campo es un número
    const updatedValue = name.includes('price') ? parseFloat(value) : value;
  
    setFormData({
      ...formData,
      [name]: updatedValue,  // Asignamos el valor actualizado
    });
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setUploadedImageUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6  p-4 sm:p-6 mt-8 mb-8">
    <div>
      <Label className="block text-xs sm:text-sm md:text-base font-medium">Título</Label>
      <Input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full h-full p-2 border border-gray-300 rounded text-xs sm:text-sm md:text-base min-h-[0px] sm:min-h-[48px] md:min-h-[56px]"
        required
      />
    </div>
    <div className="flex space-x-4 ">
  <div className="w-full">
    <Label className="block text-xs sm:text-sm md:text-base font-medium">Precio Día</Label>
    <Input
      type="number"
      name="price_morning"
      value={formData.price_morning}
      onChange={handleChange}
      className="w-full  p-2 border border-gray-300 rounded text-xs sm:text-sm md:text-base min-h-[0px] sm:min-h-[48px] md:min-h-[56px]"
      required
    />
  </div>

  <div className="w-full">
    <Label className="block text-xs sm:text-sm md:text-base font-medium">Precio Noche</Label>
    <Input
      type="number"
      name="price_evening"
      value={formData.price_evening}
      onChange={handleChange}
      className="w-full  p-2 border border-gray-300 rounded text-xs sm:text-sm md:text-base min-h-[0px] sm:min-h-[48px] md:min-h-[56px]"
      placeholder="Escribe el precio de la noche"
      required
    />
  </div>
</div>

    <div>
      <Label className="block text-xs sm:text-sm md:text-base font-medium">Descripción</Label>
      <Textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full h-full p-2 border border-gray-300 rounded text-xs sm:text-sm md:text-base min-h-[96px] sm:min-h-[112px] md:min-h-[128px] resize-none"
        rows={4}
        placeholder="Escribe la descripción del anuncio"
        required
      />
    </div>
    <div>
      <Label className="block text-xs sm:text-sm md:text-base font-medium">Subir Imagen</Label>
      <div
        className="w-full h-full sm:h-48  p-4 border border-[#C0BCBC] rounded-[30px] flex items-center justify-center cursor-pointer bg-[#F9F9F9]"
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        {!formData.image ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Image
              src="/subir.png"
              alt="Image Icon"
              width={50}
              height={50}
            />
            <p className="text-xs sm:text-sm md:text-base">Haz clic o arrastra una imagen aquí</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Image
              src={URL.createObjectURL(formData.image)}
              alt="Uploaded"
              width={120}
              height={120}
            />
            <Button
              onClick={() => {
                handleRemoveFile();
              }}
              size="icon"
            >
              X
            </Button>
          </div>
        )}
      </div>
      {uploadedImageUrl && (
        <div className="mt-4">
          <p className="text-xs sm:text-sm md:text-base">Imagen subida:</p>
          <Image
            src={uploadedImageUrl}
            alt="Uploaded URL"
            width={50}
            height={50}
          />
        </div>
      )}
    </div>
  
   
  
    <Button type="submit" className="w-full bg-[#E1BC00] text-white hover:bg-[#9b8a38] font-bold text-xs sm:text-sm md:text-base">
      Publicar
    </Button>
</form>

  
  
  
  
  );
}
