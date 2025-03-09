"use client";
import React, { useState } from "react";
import { Ysabeau_SC } from "next/font/google";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation"; // Importamos useRouter
import { API_URL } from "../../../config";
import Swal from "sweetalert2";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
const ysabeau = Ysabeau_SC({ subsets: ["latin"], weight: "400" });

export default function ImageLogin() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ dni?: string; password?: string }>({}); // ✅ useState dentro del componente
  const router = useRouter(); // Creamos una instancia de useRouter

  // Función para manejar el envío del formulario
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { dni?: string; password?: string } = {};

    if (!dni) {
      newErrors.dni = "El usuario es obligatorio.";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    // ✅ Actualizar los errores antes de hacer la solicitud
    setErrors(newErrors);

    // Si hay errores, detener el proceso de login
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Token:1", data.access_token);
        fetch(`${API_URL}/auth/me`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.access_token}`,
          }
        })
        .then(response => response.json())
        .then(data1 => {
         if(data1.rol_id == 1){
          console.log(data.access_token)
          localStorage.setItem("authToken", data.access_token);
      
          Swal.fire({
            title: "Datos correctos!",
            text: "Bienvenido al sistema",
            icon: "success",
          });
        
          router.push("/AdminGestion"); // Redirigir al usuario
         }
else{
      
  Swal.fire({
    title: "Rechazo del sistema!",
    text: "Usted no es un administrador",
    icon: "error",
  });

}

         })
        .catch((error) => {
          // Imprime errores de la solicitud fetch
          console.error("Error with PUT request:", error);
        });
        // Guardar el token en localStorage
       
      }
      else {
        const errorData = await response.json();
        Swal.fire({
          title: "Denegado",
          text: errorData.message || "Ocurrió un error inesperado.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
      });
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

          {/* Campo Usuario */}
          <div className="text-left">
            <h1 className={`${poppins.className} text-gray-700 text-sm sm:text-lg`}>Usuario</h1>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className={`w-full p-4 border rounded-3xl focus:outline-none focus:ring-2 ${
                errors.dni ? "border-red-500 focus:ring-red-500" : "focus:ring-[#006FA6]"
              }`}
            />
            {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni}</p>}
          </div>

          {/* Campo Contraseña */}
          <div className="text-left">
            <h1 className={`${poppins.className} text-gray-700 text-sm sm:text-lg`}>Contraseña</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-4 border rounded-3xl focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-[#006FA6]"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Botón Ingresar */}
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
