import React, { useState } from "react";
import {
  FaCalendarCheck,
  FaBullhorn,
  FaUser,
  FaUserShield,
  FaFileAlt,
  FaChevronDown,
} from "react-icons/fa";
import Link from "next/link";

export default function NavbarLeft() {
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 h-screen w-75 bg-white text-[#191D23] p-6 z-50 shadow-md"> {/* Aumento del ancho del menú */}
      <div className="text-gray-500 text-sm mb-4">Menú</div>
      <ul className="space-y-3">
        {/* Link Reserva */}
        <li className="flex items-center space-x-2 text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer transition duration-300 w-full">
          <Link href="/AdminGestion/Reserva" className="flex items-center space-x-2 w-full">
            <FaCalendarCheck className="text-xl" />
            <span>Reserva</span>
          </Link>
        </li>

        {/* Link Anuncio */}
        <li className="flex items-center space-x-2 text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer transition duration-300 w-full">
          <Link href="/AdminGestion/Anuncio" className="flex items-center space-x-2 w-full">
            <FaBullhorn className="text-xl" />
            <span>Anuncio web</span>
          </Link>
        </li>

        {/* Mantenimiento Local */}
        <li
          className="flex items-center space-x-2 text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
          onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
        >
          <FaUser className="text-xl" />
          <span>Mantenimiento Local</span>
          <FaChevronDown
            className={`ml-auto transition-transform duration-300 ${isClientMenuOpen ? "rotate-180" : ""}`}
          />
        </li>
        {isClientMenuOpen && (
          <ul className="space-y-2 pl-6 border-l-2 border-gray-300 w-full"> {/* Asegura que los submenús ocupen todo el ancho */}
            <li className="flex items-center justify-between">
              <Link
                href="/AdminGestion/Deportes"
                className="text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
              >
               Deportes
              </Link>
            </li>
            <li className="flex items-center justify-between">
              <Link
                href="/AdminGestion/Canchas"
                className="text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
              >
                Canchas
              </Link>
            </li>
          </ul>
        )}

        {/* Cliente Menu */}
        <li
          className="flex items-center space-x-2 text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
          onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
        >
          <FaUser className="text-xl" />
          <span>Cliente</span>
          <FaChevronDown
            className={`ml-auto transition-transform duration-300 ${isClientMenuOpen ? "rotate-180" : ""}`}
          />
        </li>
        {isClientMenuOpen && (
          <ul className="space-y-2 pl-6 border-l-2 border-gray-300 w-full"> {/* Asegura que los submenús ocupen todo el ancho */}
            <li className="flex items-center justify-between">
              <Link
                href="/Mantenimiento-cliente"
                className="text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
              >
                Lista Cliente
              </Link>
            </li>
            <li className="flex items-center justify-between">
              <Link
                href="/AdminGestion/Historial-cliente"
                className="text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
              >
                Lista suspendidos...
              </Link>
            </li>
          </ul>
        )}

        {/* Administradores Menu */}
        <li
          className="flex items-center space-x-2 text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
          onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
        >
          <FaUserShield className="text-xl" />
          <span>Administradores</span>
          <FaChevronDown
            className={`ml-auto transition-transform duration-300 ${isAdminMenuOpen ? "rotate-180" : ""}`}
          />
        </li>
        {isAdminMenuOpen && (
          <ul className="space-y-2 pl-6 border-l-2 border-gray-300 w-full"> {/* Asegura que los submenús ocupen todo el ancho */}
            <li className="flex items-center justify-between">
              <Link
                href="/AdminGestion/Mantenimiento-rol"
                className="text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
              >
                Mantenimiento roles
              </Link>
            </li>
          </ul>
        )}

        {/* Reportes Menu */}
        <li
          className="flex items-center space-x-2 text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
          onClick={() => setIsReportMenuOpen(!isReportMenuOpen)}
        >
          <FaFileAlt className="text-xl" />
          <span>Reporte</span>
          <FaChevronDown
            className={`ml-auto transition-transform duration-300 ${isReportMenuOpen ? "rotate-180" : ""}`}
          />
        </li>
        {isReportMenuOpen && (
          <ul className="space-y-2 pl-6 border-l-2 border-gray-300 w-full"> {/* Asegura que los submenús ocupen todo el ancho */}
            <li className="flex items-center justify-between">
              <Link
                href="/AdminGestion/Report-semana"
                className="text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
              >
                Semana
              </Link>
            </li>
            <li className="flex items-center justify-between">
              <Link
                href="/AdminGestion/Report-mes"
                className="text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
              >
                Mes
              </Link>
            </li>
          </ul>
        )}
      </ul>
    </nav>
  );
}
