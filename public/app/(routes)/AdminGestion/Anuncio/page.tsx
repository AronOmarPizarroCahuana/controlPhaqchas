'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PublishedItem } from "@/app/Interface/annoucement"; 
import { AnnouncementForm } from "@/components/annoucementForm"; 
import { PublishedList } from "@/components/annoucementTable"; 
import {API_URL} from "../../../../config";

export default function FormPage() {
  const [publishedItems, setPublishedItems] = useState<PublishedItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar si la pantalla es pequeña
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Para celulares
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/announcement`) 
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data?.data)) { 
          setPublishedItems(data.data);
        } else {
          console.error("La respuesta de la API no contiene un array:", data);
          setPublishedItems([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setPublishedItems([]);
      });
  }, []);

  const reloadAnnouncements = () => {
    fetch(`${API_URL}/announcement`) 
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data?.data)) { 
          setPublishedItems(data.data);
        } else {
          console.error("La respuesta de la API no contiene un array:", data);
          setPublishedItems([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setPublishedItems([]);
      });
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-10">
        <h1 className="text-2xl font-semibold mb-4 text-center font-inter text-[#7B7B7B] text-[32px]">Generar anuncios</h1>

        {isMobile ? (
          <>
            <Button 
              className="w-full bg-[#E1BC00] text-white py-2 px-4 rounded-md"
              onClick={() => setIsModalOpen(true)}
            >
              + Crear Anuncio
            </Button>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg shadow-lg relative">
                  
                  {/* Icono de Cerrar */}
                  <button 
                    className="absolute top-2 right-2 text-2xl text-gray-600"
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
              
                  <h2 className="text-xl font-bold mb-10">Nuevo Anuncio</h2>
                  <AnnouncementForm reloadAnnouncements={reloadAnnouncements} />
                </div>
              </div>
            )}
          </>
        ) : (
          // Si no es móvil, mostrar el formulario normalmente
          <AnnouncementForm reloadAnnouncements={reloadAnnouncements} />
        )}
      </div>

      <div className="w-full md:w-1/2 p-4 border-t md:border-l md:border-t-0 border-gray-300">
  <div className="overflow-x-auto max-h-[calc(100vh-250px)] md:max-h-[calc(100vh-200px)]"> 
    <PublishedList publishedItems={publishedItems} />
  </div>
</div>


    </div>
  );
}
