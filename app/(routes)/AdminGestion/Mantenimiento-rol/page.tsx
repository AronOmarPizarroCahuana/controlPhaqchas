'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Admin } from "@/app/Interface/admin";
import AdminForm from "@/components/Roles/Insert-roles/insert-roles"; 
import { AdminList } from "@/components/Roles/Tabla-roles"; 
import { API_URL } from "../../../../config";

export default function FormPage() {
  const [publishedItems, setPublishedItems] = useState<Admin[]>([]);
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
    fetch(`${API_URL}/admi`) 
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

  const fetchAdmins = () => {
    fetch(`${API_URL}/admi`)
      .then((response) => response.json())
      .then((data) => {
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

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-10">
        <h1 className="text-2xl font-semibold mb-4 text-center text-[#7B7B7B] text-[25px] sm:text-[32px]">
          Gestionar Administradores
        </h1>

        {isMobile ? (
          <>
            <Button
              className="w-full bg-[#E1BC00] text-white py-2 px-4 rounded-md"
              onClick={() => setIsModalOpen(true)}
            >
              + Crear Administrador
            </Button>

            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-11/12 max-w-lg shadow-lg relative">
                  <button
                    className="absolute top-2 right-2 text-2xl text-gray-600"
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>

                  <h2 className="text-xl font-bold mb-4">Nuevo Administrador</h2>
                  <AdminForm onSubmit={fetchAdmins} reloadAnnouncements={fetchAdmins} />
                </div>
              </div>
            )}
          </>
        ) : (
          <AdminForm onSubmit={fetchAdmins} reloadAnnouncements={fetchAdmins} />
        )}
      </div>

      <div className="w-full md:w-1/2 p-4 border-t md:border-l md:border-t-0 border-gray-300">
        <div className="overflow-x-auto max-h-[calc(100vh-250px)] md:max-h-[calc(100vh-200px)]">
          <AdminList FieldItems={publishedItems} />
        </div>
      </div>
    </div>
  );
}
