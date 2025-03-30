"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../logo/logo";
import Menu from "../Menu/Menu";
import { FiLogOut } from "react-icons/fi"; // Icono para cerrar sesión en móviles

export default function NavbarTop() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedRoles = localStorage.getItem("roles");

    if (storedRoles) {
      const roles = JSON.parse(storedRoles);
      setIsAdmin(roles.includes("Administrador"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("roles");
    router.push("/"); // Redirige a la página de login
  };

  return (
    <nav className="top-0 left-0 fixed w-full h-12 flex items-center px-4 bg-white z-50 sm:h-16">
      <div className="flex items-center mt-2 sm:mt-0">
         {/* Botón de cerrar sesión en móviles (icono) */}
      {!isAdmin && (
        <button 
          onClick={handleLogout} 
          className="mr-auto text-red-500 sm:hidden"
        >
          <FiLogOut size={24} /> {/* Icono de logout */}
        </button>
      )}
        {isAdmin ? (
          <Menu /> // Muestra el menú si es Administrador
        ) : (
          // Botón de cerrar sesión
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition hidden sm:block"
          >
            Cerrar Sesión
          </button>
        )}
      </div>

      <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 ml-auto mt-5 md:mt-5">
        <Logo />
      </div>

     
    </nav>
  );
}
