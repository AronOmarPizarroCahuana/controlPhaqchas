"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export type NavbarLeftGroupProps = {
  icon?: LucideIcon;
  label: string;
  items: { label: string; link: string }[];
};

export default function NavbarLeftGroup({ icon: Icon, label, items }: NavbarLeftGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Obtiene la ruta actual

  const toggleGroup = () => setIsOpen(!isOpen);

  return (
    <div className="w-full p-2">
      {/* Botón principal del grupo */}
      <span
        className="w-full p-2 flex items-center justify-between py-4 transition-all text-md text-black/70 hover:cursor-pointer hover:text-purple-700 hover:bg-gray-300/80 rounded-lg"
        onClick={toggleGroup}
      >
        <div className="flex items-center gap-x-4 pl-6">
          {Icon && <Icon size={20} />}
          <span>{label}</span>
        </div>
        <ChevronRight
          size={16}
          className={clsx(
            "transition-all duration-300 text-sm ease-in-out",
            isOpen && "rotate-90"
          )}
        />
      </span>

      {/* Lista de elementos del grupo */}
      <ul
        className={clsx(
          "overflow-hidden transition-[max-height] duration-300 ease-in-out rounded-lg py-2 pl-4 relative",
          isOpen ? "max-h-40" : "max-h-0"
        )}
      >
        <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-gray-800/80"></div>

        {items.map((item) => (
          <li key={item.link} className="w-full px-2 relative">
            <span
              className={clsx(
                "absolute -left-1 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gray-800/80 transition-all",
                pathname === item.link && "bg-purple-700"
              )}
            ></span>

            <Link
              href={item.link}
              className={clsx(
                "w-full pl-10 text-black flex items-center gap-x-4 py-2 transition-all text-md font-light hover:text-purple-700 rounded-lg relative group",
                pathname === item.link && "text-purple-700 font-bold"
              )}
            >
              <span
                className={clsx(
                  "w-3 h-3 rounded-full left-3 top-1/2 bg-purple-500 absolute -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
                  pathname === item.link && "bg-purple-700 opacity-100"
                )}
              ></span>

              <span className={pathname === item.link ? "font-bold" : ""}>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
