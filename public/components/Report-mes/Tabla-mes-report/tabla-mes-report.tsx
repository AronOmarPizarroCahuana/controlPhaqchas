// Componente que recibe los parámetros
"use client";
import { useEffect, useState } from "react";
import { Booking } from "./report-mes";
import {API_URL} from "../../../config";

interface Props {
  meses: number[]; // Recibe los meses
  año: number; // Recibe el año
}

export default function ReporMes({ meses, año }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fieldTotals, setFieldTotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URLC = `${API_URL}/bookingsForAdmiMonth/${meses}/${año}`;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_URLC);
        const data = await response.json();

        if (data.type === "success" && data.data) {
          const { bookings, fieldTotals } = data.data;
console.log(bookings)
          if (Array.isArray(bookings) && typeof fieldTotals === "object") {
            setBookings(bookings);
            setFieldTotals(fieldTotals);
          } else {
            setError("Los datos recibidos no son válidos.");
          }
        } else {
          setError("No se pudieron cargar los datos correctamente.");
        }
      } catch (err) {
        setError("Error al obtener los datos: " + err);
      } finally {
        setLoading(false);
      }
    }
 

    fetchData();
  }, [año]); // Se ejecuta cada vez que cambie el año

  if (loading) {
    return <p className="text-center mt-10">Cargando datos...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }
  const obtenerMes = (numeros: number[]): string[] => {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    // Mapeamos los números a sus respectivos meses
    return numeros.map((numero) => meses[numero - 1]);
  };
  
  // El resto de la lógica de formateo de fechas y campos sigue igual
  const formatDate = (date: string) => {
    const daysOfWeek = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  
    // Convertir la fecha a un objeto Date asegurando la zona horaria local
    const d = new Date(date + "T00:00:00"); 
  
    const dayOfWeek = daysOfWeek[d.getDay()];
    const dayOfMonth = d.getDate();
  
    return `<div class="block">${dayOfWeek}</div><div class="block">${dayOfMonth}</div>`;
  };
  

  // Obtener las fechas de los datos de reservas
  const dates = bookings.map((booking) => booking.date);
console.log(dates)
  // Crear un mapa de los campos y sus valores para cada fecha
  const fieldData: Record<string, Record<string, number>> = {};
  bookings.forEach((booking) => {
    booking.fields.forEach((field) => {
      if (!fieldData[field.field]) {
        fieldData[field.field] = {};
      }
      fieldData[field.field][booking.date] = field.total;
    });
  });

  return (
    <div className="container mx-3 p-4">
    <h1 className="text-2xl font-bold mb-4">{obtenerMes(meses)} {año} </h1>
    <div className="overflow-x-visible">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-6 py-2  bg-[#93A3C4] text-white">Campo</th>
            {dates.map((date, index) => (
              <th
              key={index}
              className="border border-gray-300 px-4 py-2 text-center text-sm bg-[#93A3C4] text-white"
              dangerouslySetInnerHTML={{ __html: formatDate(date) }}
            />
            
            ))}
            <th className="border border-gray-300 px-4 py-2 bg-blue-500 text-white">Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(fieldData).map((fieldName, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border border-gray-300 px-4 py-2 font-bold">
                {fieldName}
              </td>
              {dates.map((date, i) => (
                <td
                  key={i}
                  className="border border-gray-300 px-4 py-2 text-center "
                >
                  {fieldData[fieldName][date] || 0}
                </td>
              ))}
              <td className="border border-gray-300 px-4 py-2 font-bold text-center bg-blue-500 text-white">
                {fieldTotals[fieldName] || 0}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-200">
            <td className="border border-gray-300 px-4 py-2 font-bold bg-blue-500 text-white">
              Total
            </td>
            {dates.map((date, index) => (
              <td
                key={index}
                className="border border-gray-300 px-4 py-2 font-bold text-center bg-blue-500 text-white"
              >
                {
                  bookings.find((booking) => booking.date === date)
                    ?.totalMonth || 0
                }
              </td>
            ))}
            <td className="border border-white px-4 py-2 font-bold text-center bg-white ">
           
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);
}