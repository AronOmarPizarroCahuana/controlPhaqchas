"use client"; 

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

    if (pathname !== "/AdminGestion" && pathname !== "/AdminGestion/Reserva-zoom" && (!token || !roles.includes("Administrador"))) {
      router.push("/AdminGestion");
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  if (!isAuthorized) return null; 

  return (
    <div className="min-h-screen flex flex-col">
      <div className="md:block w-full">
        <NavbarTop />
      </div>
      <div className="flex-grow w-full mt-12">{children}</div>
    </div>
  );
}
