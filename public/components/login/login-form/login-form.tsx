"use client"
import React, { useState } from "react";
import { Ysabeau_SC } from "next/font/google";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation"; // Importamos useRouter
import {API_URL} from "../../../config";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
const ysabeau = Ysabeau_SC({ subsets: ["latin"], weight: "400" });

export default function ImageLogin() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Creamos una instancia de useRouter

  // Función para manejar el envío del formulario
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dni,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Token:", data.access_token); // Aquí recibes el token
        // Puedes almacenar el token en localStorage o en un estado global si es necesario
        router.push("/AdminGestion"); // Rediriges al usuario a la ruta deseada
      } else {
        // Si la respuesta no es exitosa, mostramos un mensaje en la consola
        console.log("La contraseña o el usuario están mal");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen p-4 sm:p-6 md:p-0">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full sm:w-[500px] md:w-[700px] h-auto text-center">
        <div className="space-y-6">
          <h1 className={`${ysabeau.className} text-3xl sm:text-4xl font-bold text-[#006FA6]`}>
            PHAQCHAS
          </h1>
          <h2 className={`${poppins.className} text-gray-600 text-base sm:text-lg`}>
            Inicie sesión para ingresar al sistema
          </h2>

          <div className="text-left">
            <h1 className={`${poppins.className} text-gray-700 text-sm sm:text-lg`}>Usuario</h1>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full p-4 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#006FA6]"
            />
          </div>

          <div className="text-left">
            <h1 className={`${poppins.className} text-gray-700 text-sm sm:text-lg`}>Contraseña</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#006FA6]"
            />
          </div>

          <button
            onClick={handleLogin}
            className={`${poppins.className} w-full sm:w-96 bg-[#006FA6] text-base sm:text-lg text-white font-medium py-2 rounded-2xl hover:bg-[#005a85] transition`}
          >
            INGRESAR
          </button>
        </div>
      </div>
    </div>
  );
}
