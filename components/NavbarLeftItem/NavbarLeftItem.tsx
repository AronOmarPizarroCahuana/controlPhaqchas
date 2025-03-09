import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { NavbarLeftProps } from './NavbarLeftItem.types';

export default function NavbarLeftItem({icon: Icon, label, link}: NavbarLeftProps) {
    const pathname = usePathname(); 
  const isActive = pathname === link; 

  return (
    <li className="w-full p-2">
      <Link
        href={link}
        className={`w-full pl-8 flex items-center rounded-lg gap-x-4 py-4 transition-all text-md text-black/70
          hover:text-purple-700 hover:bg-gray-300/80 hover:border-gray-800 
          ${isActive ? "bg-gray-300/80 text-purple-700 font-bold" : ""}`}
      >
        {Icon && <Icon size={20} className="text-current" />} 
        <span>{label}</span>
      </Link>
    </li>
  );
}
