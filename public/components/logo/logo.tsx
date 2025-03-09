import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <Link href="/" className="uppercase text-2xl flex items-center text-gray-900 gap-2 mb-8 h-16">
      <Image src="/volleyball.png" alt="Logo" width={40} height={40} priority />
      <h1 className="text-shadow-heavy font-Bebas-Neue">Phaqchas</h1>
    </Link>
  );
}
