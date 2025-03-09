"use client";

import React, { useState } from "react";
import NavbarLeft from "../NavbarLeft/NavbarLeft";
import Image from "next/image"; // Importación de Image de Next.js

export default function Menu() {
  // Estado para controlar la visibilidad del menú
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para alternar la visibilidad del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Botón de menú */}
      <div className="flex items-center space-x-4">
        <button
          className="rounded-full flex items-center justify-center bg-[#F2D335] w-8 h-8 sm:h-12 sm:w-12"
          onClick={toggleMenu}
        >
          <Image 
            src="/menu.png" 
            alt="Menu" 
            width={32} 
            height={32} 
            className="w-5 h-5 sm:w-7 sm:h-7" 
          />
        </button>
        <h1 className="text-shadow-heavy font-Bebas-Neue text-black text-lg">Menu</h1>
      </div>

      {/* Menú deslizante */}
      <div>
  {isMenuOpen && (
    <div
      className="fixed inset-0 bg-[#00000000] bg-opacity-50 z-40"
      onClick={() => setIsMenuOpen(false)}
    ></div>
  )}

  <div
    className={`fixed top-0 left-0 w-64 h-screen bg-white z-50 transform ${
      isMenuOpen ? "translate-x-0" : "-translate-x-full sm:-translate-x-72"
    } transition-transform duration-300`}
    style={{ marginTop: "4rem" }}
  >
    <NavbarLeft />
  </div>
</div>

    </div>
  );
}
