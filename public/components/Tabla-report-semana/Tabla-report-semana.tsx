'use client';
import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Reservation, Day } from '../Tabla/Reservation';
import { Table } from '@/components/ui/table';
import ReservaM from "../ReservaM/ReservaM";
import {API_URL} from "../../config";

interface TablaProps {
  field: string;
  currentWeekStart: Date;
  startDate: string;
  endDate: string;
  id: string;
}

export default function Tabla({
  field,
  currentWeekStart,
  startDate,
  endDate,
  id,
}: TablaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    timeStart: string;
    timeEnd:string;
    day: Date;
    user_id?: string;
    yape?: number;
  } | null>(null);

  
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const handleCellClick = (timeStart: string,timeEnd:string, day: string, reservation: Day) => {
    let contador = 0;

switch (day) {
  case "Lunes":
    contador = 0;
    break;
  case "Martes":
    contador = 1;
    break;
  case "Miércoles":
    contador = 2;
    break;
  case "Jueves":
    contador = 3;
    break;
  case "Viernes":
    contador = 4;
    break;
  case "Sábado":
    contador = 5;
    break;
  case "Domingo":
    contador = 6;
    break;
}
    const selectedDay = reservation
    console.log("Day before formatting:", days[contador]); // Verifica la estructura de 'day'
    console.log("rservacion",selectedDay)
  
   
    if (selectedDay && selectedDay.status!=="disponible" ) {

      setModalData({
        timeStart,
        timeEnd,
        day: days[contador],
        user_id: "",
        yape:  0,
      });

      setIsModalOpen(true);

    }
    else{
      console.log("no se pudo abrir el modal")
      console.log(selectedDay.status)
    }
  };
  
  
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };
 

  const fetchDatos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/bookingsForAdmi/${field}/${startDate}/${endDate}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const { data } = await response.json();
      setReservations(data);
      console.log(data)
    } catch (err) {
console.log(err)   
 } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [startDate, endDate, id]);

  const handleSaveReservation = (data: { user_id: string; yape: number; price: number; }) => {
    if (!modalData) return;
  
    const { timeStart, day } = modalData;
  
    // Verificar que 'day' sea un objeto Date válido
    if (!(day instanceof Date)) {
      console.error("La variable 'day' no es un objeto Date válido");
      return;
    }
  
    console.log("Guardando reserva con los siguientes datos:", data, modalData);
  
    setReservations((prev) => {
      const updatedReservations = prev.map((reservation) => {
        if (reservation.hour_range?.start === timeStart) {
          console.log("Reserva encontrada, actualizando detalles");
  
          const updatedDays = reservation.days.map((d) => {
            const formattedDay = format(new Date(d.day_name), "eeee", { locale: es });
            const selectedDayFormatted = format(day, "eeee", { locale: es });
  
            console.log(`Comparando días: ${formattedDay} === ${selectedDayFormatted}`);
  
            if (formattedDay === selectedDayFormatted) {
              console.log("Actualizando detalles de la reserva...");
              return {
                ...d,
                booking_details: {
                  id_user: data.user_id,
                  yape: data.yape,
                  price: data.price,
                  id: Date.now(), // Usa un UUID si necesitas algo más único
                  user_name: "",
               
                },
              };
            }
            return d;
          });
  
          return { ...reservation, days: updatedDays };
        }
  
        return reservation;
      });
  
      console.log("Reservas actualizadas:", updatedReservations); // Verifica la actualización
      return updatedReservations;
    });
  
    handleCloseModal();
  };
  



  if (loading) 
   {
    return <div>cargando ..</div>
   }
  
  
  return (
    <div className="overflow-x-auto">
      <Table className="table-fixed w-full text-sm border-separate min-w-[1500px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-[5%]"></th>
            <th className="border p-3 bg-[#5A6BA0] text-white w-[10%]">Hora</th>
            {days.map((day) => (
              <th
                key={day.toISOString()}
                className="border p-3 text-center bg-[#8D9EC1] text-white"
              >
                <div>{format(day, "eeee", { locale: es })}</div>
                <div>{format(day, "d")}</div>
              </th>
            ))}
          </tr>
      
        </thead>
        <tbody>
        
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td className="rotate-0 border text-center">CAMPO {field}</td>
              {reservation.hour_range && (
                <td className="border text-center">
                  {reservation.hour_range.start} - {reservation.hour_range.end}
                </td>
              )}
              {reservation.days.map((day, dayIndex) => {
                const status = day.status || "disponible";
                return (
                  <td
                    key={dayIndex}
                    className={`border px-4 py-2 text-xs ${status}`}
                    onClick={() => {
                      const selectedDay = reservation.days.find(d => d.day_name === day.day_name);

                      if (selectedDay) {
                        handleCellClick(reservation.hour_range.start,reservation.hour_range.end, day.day_name, selectedDay);
                      } else {
                        console.log("No se encontró el día correspondiente en reservation.days");
                      }
                    }}>
                      
                    {day.booking_details ? (
                      <div className=" justify-between text-center w-full">
                        <span>{day.booking_details.user_name}</span>
                       
                      </div>
                    ) : (
                      <div className="text-center">...</div>
                    )}
                  </td>
                );

              }
              )}
             
                        </tr>
          ))
          }
          <th></th>
          <th className="bg-cyan-600 text-white">Total</th>
          {days.map((day) => (
              <th
                key={day.toISOString()}
                className="border p-3 text-center bg-cyan-600 text-white"
              >
                <div> </div>
             
              </th>
            ))}
        </tbody>
        
      </Table>

      {modalData && isModalOpen && (
       
       <ReservaM
         field={field}
         timeStart={modalData.timeStart}
         timeEnd={modalData.timeEnd}
         day={modalData.day}
         isOpen={isModalOpen}
         onClose={handleCloseModal}
         onSave={handleSaveReservation}
          initialData={{
            user_id: modalData.user_id || "",
            yape: modalData.yape || 0,
            sport_id:"1",

          }}
        />
      )}
        
    </div>
  );
}
