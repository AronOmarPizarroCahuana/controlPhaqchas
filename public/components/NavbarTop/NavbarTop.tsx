
import React from "react";
import Logo from "../logo/logo";
import Menu from "../Menu/Menu";
export default function NavbarTop() {

    return (
        <nav className="top-0 left-0 fixed w-full h-16 flex items-center px-4 bg-white z-50">
        {/* Menú a la izquierda */}
        <div className="flex items-center">
          <Menu />
        </div>
      
        {/* Logo centrado en pantallas grandes, a la derecha en móviles */}
        <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 ml-auto mt-5 md:mt-5">
          <Logo />
        </div>
      </nav>
      
      
      
    );
}