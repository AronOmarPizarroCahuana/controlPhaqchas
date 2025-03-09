import React, { useState } from "react";
import { usePathname } from "next/navigation";
import NavbarLeftItem from "../NavbarLeftItem/NavbarLeftItem";
import NavbarLeftGroup from "../NavbarLeftGroup/NavbarLeftGroup";
import { menuItems } from "./NavbarLetf.data";
import { Link, LogOut, LogOutIcon } from "lucide-react";

export default function NavbarLeft() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const handleLogout = () => {};

  const toggleGroup = (label: string) => {
    setActiveGroup(activeGroup === label ? null : label);
  };

  return (
    <aside className="fixed top-0 -mt-4  sm:mt-0 left-0 h-[calc(100vh-48px)] w-75 sm:w-72 bg-white text-[#191D23] z-50 shadow-md flex flex-col justify-between overflow-auto">
      <nav className="p-2">
        <ul>
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.type === "separator" && isOpen && (
                <span className="px-4 text-gray-500 text-sm">{item.label}</span>
              )}
              {item.type === "item" && (
                <NavbarLeftItem label={item.label} icon={item.icon} link={item.link} />
              )}
              {item.type === "group" && (
                <NavbarLeftGroup
                  label={item.label}
                  icon={item.icon}
                  items={item.items}
                />
              )}
            </div>
          ))}
        </ul>
      </nav>
      <div className="py-3 px-2 flex items-center justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center mb-8 sm:mb-10 lg:mb-16 space-x-2 bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition duration-300 "
        >
          <LogOutIcon className="text-lg" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );

  /*return (
    <nav className="fixed top-0 -mt-4  sm:mt-0 left-0 h-screen w-75 sm:w-72 bg-white text-[#191D23] p-6 z-50 shadow-md flex flex-col justify-between">
      <div>
        <div className="text-gray-500 text-sm mb-4">Menú</div>
        <ul className="space-y-3">
          <li className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full">
            <Link href="/AdminGestion/Reserva" className="flex items-center space-x-2 w-full">
              <FaCalendarCheck className="sm:text-xl" />
              <span>Reserva</span>
            </Link>
          </li>

          <li className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full">
            <Link href="/AdminGestion/Anuncio" className="flex items-center space-x-2 w-full">
              <FaBullhorn className="sm:text-xl" />
              <span>Anuncio web</span>
            </Link>
          </li>

          <li
            className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
            onClick={() => toggleMenu("mantenimiento")}
          >
            <FaUser className="sm:text-xl" />
            <span>Mantenimiento Local</span>
            <FaChevronDown
              className={`ml-auto transition-transform duration-300 ${
                openMenu === "mantenimiento" ? "rotate-180" : ""
              }`}
            />
          </li>
          {openMenu === "mantenimiento" && (
            <ul className="space-y-2 pl-6 border-l-2 border-gray-400 w-full bg-gray-100">
              <li>
                <Link
                  href="/AdminGestion/Deportes"
                  className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-300 p-3 rounded-md block"
                >
                  Deportes
                </Link>
              </li>
              <li>
                <Link
                  href="/AdminGestion/Canchas"
                  className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-300 p-3 rounded-md block"
                >
                  Canchas
                </Link>
              </li>
            </ul>
          )}

          <li
            className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
            onClick={() => toggleMenu("cliente")}
          >
            <FaUser className="sm:text-xl" />
            <span>Cliente</span>
            <FaChevronDown
              className={`ml-auto transition-transform duration-300 ${
                openMenu === "cliente" ? "rotate-180" : ""
              }`}
            />
          </li>
          {openMenu === "cliente" && (
            <ul className="space-y-2 pl-6 border-l-2 border-gray-400 w-full bg-gray-100">
              <li>
                <Link
                  href="/AdminGestion/Mantenimiento-cliente"
                  className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-300 p-3 rounded-md block"
                >
                  Mantenimiento
                </Link>
              </li>
              <li>
                <Link
                  href="/AdminGestion/Historial-cliente"
                  className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-300 p-3 rounded-md block"
                >
                  Clientes frecuentes
                </Link>
              </li>
            </ul>
          )}

          <li
            className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
            onClick={() => toggleMenu("admin")}
          >
            <FaUserShield className="sm:text-xl" />
            <span>Administradores</span>
            <FaChevronDown
              className={`ml-auto transition-transform duration-300 ${
                openMenu === "admin" ? "rotate-180" : ""
              }`}
            />
          </li>
          {openMenu === "admin" && (
            <ul className="space-y-2 pl-6 border-l-2 border-gray-400 w-full bg-gray-100">
              <li>
                <Link
                  href="/AdminGestion/Mantenimiento-rol"
                  className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-300 p-3 rounded-md block"
                >
                  Mantenimiento roles
                </Link>
              </li>
            </ul>
          )}

          <li
            className="flex items-center space-x-2 text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-100 p-3 rounded-md cursor-pointer w-full"
            onClick={() => toggleMenu("reporte")}
          >
            <FaFileAlt className="sm:text-xl" />
            <span>Reporte</span>
            <FaChevronDown
              className={`ml-auto transition-transform duration-300 ${
                openMenu === "reporte" ? "rotate-180" : ""
              }`}
            />
          </li>
          {openMenu === "reporte" && (
            <ul className="space-y-2 pl-6 border-l-2 border-gray-400 bg-gray-100 w-full">
              <li>
                <Link
                  href="/AdminGestion/Report-mes"
                  className="text-[13px] sm:text-[16px] font-semibold font-manrope hover:bg-gray-300 p-3 rounded-md block"
                >
                  Mes
                </Link>
              </li>
            </ul>
          )}
        </ul>
      </div>

      <Link
      href="/"

        onClick={handleLogout}
        className="flex items-center justify-center mb-8 sm:mb-10 lg:mb-16 space-x-2 bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition duration-300 "
      >
        <FaSignOutAlt className="text-lg" />
        <span>Cerrar Sesión</span>
      </Link>
    </nav>
  );*/
}
