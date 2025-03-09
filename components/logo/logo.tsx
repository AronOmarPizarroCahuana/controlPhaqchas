import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <Link href="/AdminGestion" className="uppercase text-2xl flex items-center text-gray-900 gap-2 mb-8 h-0 mt-4 sm:mt-0">
    <Image src="/volleyball.png" alt="Logo" width={40} height={40} className="w-[30px] sm:w-[40px] md:w-[50px] h-auto" priority />
    <h1 className="text-shadow-heavy font-Bebas-Neue text-[15px] sm:text-[23px]">Phaqchas</h1>
  </Link>
  
  );
}
