"use client"; // Necesario porque usamos useEffect y useState

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NavbarTop from "@/components/NavbarTop/NavbarTop";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");

    // Permitir solo la página "/reserva"
    if (pathname !== "/AdminGestion" && (!token || !roles.includes("Administrador"))) {
      router.push("/AdminGestion"); // Redirigir a "/reserva"
    } else {
      setIsAuthorized(true);
    }
  }, [pathname]);

  if (!isAuthorized) return null; // Evita mostrar la app mientras se valida el acceso

  return (
    <div className="min-h-screen flex flex-col">
      <div className="md:block w-full">
        <NavbarTop />
      </div>
      <div className="flex-grow w-full mt-12">{children}</div>
    </div>
  );
}
