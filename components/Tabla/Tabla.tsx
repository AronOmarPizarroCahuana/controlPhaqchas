import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Reservation, Day } from './Reservation';
import { Table } from '@/components/ui/table';
import ReservaM from "../ReservaM/ReservaM";
import ReservaEdit from "../ReservaEdit/ReservaEdit";
import {API_URL} from "../../config";
import {  TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

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
    sport_id?:string;

  } | null>(null);

  const [isModalOpenE, setIsModalOpenE] = useState(false);
  const [modalDataE, setModalDataE] = useState<{
    timeStart: string;
    timeEnd:string;
    day: Date;
    booking_id:number;
    user_id?: string;
    yape?: number;
    price?:number;
    sport_id?:string;
  } | null>(null);
  const [animatingCell, setAnimatingCell] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  const convertTo24HourFormat = (time: string) => {
    const [hour, minutePart] = time.split(':');
    const [minute, ampm] = minutePart.trim().split(' ');
  
    let hour24 = parseInt(hour, 10);
    if (ampm === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (ampm === 'AM' && hour24 === 12) {
      hour24 = 0; // 12 AM is midnight (00:00)
    }
  
    return `${hour24.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
  };
  
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const handleCellClick = (timeStart: string,timeEnd:string, day: string, reservation: Day ,status:string) => {
    let contador = 0;
    if (status !== "completado") {
      const cellKey = `${timeStart}-${timeEnd}-${day}`;
    
      if (animatingCell && animatingCell !== cellKey) {
        console.log("Apagando animación en:", animatingCell);
        setAnimatingCell(null); // Apagar la animación de la celda anterior
      }
    
      console.log("Iniciando animación en:", cellKey);
      setAnimatingCell(cellKey); // Activar la nueva celda
    }
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
    //console.log("Day before formatting:", days[contador]); // Verifica la estructura de 'day'
    console.log("rservacion",selectedDay)
    if (selectedDay && selectedDay.booking_details && (selectedDay.status==="reservado" || selectedDay.status==="en espera")) {
      setModalDataE({
        timeStart,
        timeEnd,
        day: days[contador],
        booking_id:selectedDay.booking_details.id ,
        user_id: selectedDay.booking_details.id_user || "",
        yape: selectedDay.booking_details.yape || 0,
        price:selectedDay.booking_details.price || 0,
 //       sport_id: selectedDay.booking_details.id_sport|| "",

      });
      setIsModalOpenE(true);
    // console.log(Daysreservations)
      
    }else
    if (selectedDay && selectedDay.status==="disponible" ) {

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
    //  console.log("no se pudo abrir el modal")
      //console.log(selectedDay.status)
    }
  };
  
  
  

  const handleCloseModal = () => {
    setTimeout(() => {
      setAnimatingCell(null); // Detenemos la animación
    }, 500);
    setIsModalOpen(false);
    setModalData(null);
  };
  const handleCloseModalE = () => {
    setTimeout(() => {
      setAnimatingCell(null); // Detenemos la animación
    }, 500);
    setIsModalOpenE(false);
    setModalDataE(null);
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
    } catch (err) {
console.log(err)   
 } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [startDate, endDate, id]);

  const handleSaveReservation = async (data: { 
    user_id: string;
    yape: number;
    price: number;
    field_id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    sport_id: number;
    total: number;
}) => {
    if (!modalData) {
      //  console.error("❌ Error: modalData es undefined o null");
        return;
    }

    const { timeStart, day } = modalData;

    // Convertir tiempos
    const formattedStartTime = convertTo24HourFormat(timeStart);

    if (!(day instanceof Date)) {
       // console.error("❌ Error: 'day' no es un objeto Date válido");
        return;
    }

    // ✅ Actualiza las reservas clonando los datos
    setReservations((prev) => {
        const updatedReservations = prev.map((reservation) => {
            if (reservation.hour_range?.start === formattedStartTime) {
                const newDays = reservation.days.map((d) => {
                    if (format(new Date(d.day_name), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")) {
                        return {
                            ...d,
                            booking_details: {
                                id: Date.now(),
                                id_user: data.user_id,
                                yape: data.yape,
                                price: data.price,
                                total: data.total,
                            },
                        };
                    }
                    return d;
                });

                return { ...reservation, days: [...newDays] };
            }
            return reservation;
        });

        return [...updatedReservations]; // Forzar re-render
    });
    //setAnimationState('animating');
    
    // Después de 5 segundos, restablecer el estado de la animación
    setTimeout(() => {
      setAnimatingCell(null); // Detenemos la animación
    }, 500);
    // 🔄 Forzar actualización llamando nuevamente a fetchDatos
    await fetchDatos();

   // console.log("✅ La tabla se ha actualizado correctamente.");
    handleCloseModal();
};

// 🔄 Verifica si el estado se está actualizando correctamente
useEffect(() => {
   // console.log("🔄 Estado actualizado:", reservations);
}, [reservations]);


const handleSaveReservationE = async (data: { 
   user_id: string;
    start_time: string;
    end_time: string;
    booking_date: string;
    yape: number;
    price: number;
}) => {
  if (!modalDataE) return;

  const { timeStart, day } = modalDataE;

  if (!(day instanceof Date)) {
     console.error("La variable 'day' no es un objeto Date válido");
    return;
  }

  // Convertir la hora a formato de 24 horas
  const formattedStartTime = convertTo24HourFormat(timeStart);

  // ✅ Actualiza las reservas clonando los datos
  setReservations((prev) => {
    const updatedReservationsE = prev.map((reservation) => {
      if (reservation.hour_range?.start === formattedStartTime) {
        const newDays = reservation.days.map((d) => {
          // Compara las fechas usando 'yyyy-MM-dd' para asegurarse de que las fechas coincidan
          if (format(new Date(d.day_name), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")) {
            return {
              ...d,
              booking_details: {
                id: Date.now(), // Usar el timestamp como ID único
                id_user: data.user_id,
                yape: data.yape,
                price: data.price,
                total: data.yape + data.price, // Calculando el total según los datos recibidos
              },
            };
          }
          return d;
        });

        return { ...reservation, days: [...newDays] };
      }
      return reservation;
    });

    return [...updatedReservationsE]; // Forzar re-render
  });
  setTimeout(() => {
    setAnimatingCell(null); // Detenemos la animación
  }, 500);
  // 🔄 Llamada para actualizar los datos de la tabla sin recargar la página
  await fetchDatos();

  // Cerrar el modal después de guardar la reserva
  handleCloseModalE();
};

// 🔄 Verifica si el estado se está actualizando correctamente
useEffect(() => {
   console.log("🔄 Estado actualizado:", reservations);
}, [reservations]);


  

  const getColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "disponible":
        return "bg-white text-black";
      case "reservado":
        return "bg-orange-500 text-white";
      case "en espera":
        return "bg-yellow-400 text-white";
      case "completado":
        return "bg-red-800 text-white";
      default:
        return "bg-gray-800 text-white";
    }
  };


  if (loading ) 
   {
    return <div>

<Table className="table-fixed w-full text-sm border-separate min-w-[1500px]">
  <TableHeader>
    <TableRow>
      <TableHead className="w-[5%]">&nbsp;</TableHead>
      <TableHead className="border p-3 w-[10%]">
        {typeof window !== 'undefined' && <Skeleton className="h-4 w-16" />}
      </TableHead>
      {[...Array(7)].map((_, index) => (
        <TableHead key={`header-${index}`} className="border p-3 text-center">
          {typeof window !== 'undefined' && (
            <>
              <Skeleton className="h-4 w-20 mx-auto" />
              <Skeleton className="h-3 w-10 mx-auto mt-1" />
            </>
          )}
        </TableHead>
      ))}
    </TableRow>

    <TableRow>
      <TableHead className="w-[5%]">&nbsp;</TableHead>
      <TableHead className="w-[5%]">
        {typeof window !== 'undefined' && <Skeleton className="h-4 w-16" />}
      </TableHead>
      {[...Array(7)].map((_, index) => (
        <TableHead key={`subheader-${index}`} className="border px-4 py-2 text-xs">
          {typeof window !== 'undefined' && (
            <div className="flex justify-between items-center w-full">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-8" />
            </div>
          )}
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>

  <TableBody>
    {[...Array(12)].map((_, rowIndex) => (
      <TableRow key={`row-${rowIndex}`}>
        <TableCell className="border text-center">
          {typeof window !== 'undefined' && <Skeleton className="h-4 w-20 mx-auto" />}
        </TableCell>
        <TableCell className="border text-center">
          {typeof window !== 'undefined' && <Skeleton className="h-4 w-24 mx-auto" />}
        </TableCell>
        {[...Array(7)].map((_, cellIndex) => (
          <TableCell key={`cell-${rowIndex}-${cellIndex}`} className="border px-4 py-2 text-xs text-center">
            {typeof window !== 'undefined' && <Skeleton className="h-6 w-full" />}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
</Table>


    </div>
   }
  
  
  return (
    <div className="overflow-x-auto bg-neutra">
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
          <tr>
            <th className="w-[5%]"></th>
            <th className="w-[5%] bg-[#5A6BA0] text-white">Detalle</th>
            {days.map((day, index) => (
              <th key={index} className="border px-4 py-2 text-xs bg-[#8D9EC1] text-white">
                <div className="flex justify-between items-center w-full">
                  <span>Reserva</span>
                  <span>Yape</span>
                  <span>Precio</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td className="rotate-0 border text-[12px] font-bold font-inter text-center bg-white text-[#454545]">CAMPO {field}</td>
              {reservation.hour_range && (
                <td className="border text-center text-[13px] font-semibold font-inter  bg-white text-[#454545]">
                  {reservation.hour_range.start} - {reservation.hour_range.end}
                </td>
              )}
              {reservation.days.map((day, dayIndex) => {
                const status = day.status || "disponible";
                const cellKey = `${reservation.hour_range.start}-${reservation.hour_range.end}-${day.day_name}`;

                return (
                  <td
                  key={dayIndex}
                  className={`border px-4 py-2 text-xs ${getColorClass(status)} 
                    ${animatingCell === cellKey ? 'animate-colorAnimation' : ''}`}
                  onClick={() => {
                    const selectedDay = reservation.days.find(d => d.day_name === day.day_name);
                    if (selectedDay) {
                      handleCellClick(reservation.hour_range.start, reservation.hour_range.end, day.day_name, selectedDay,status);
                    }
                  }}
                >
                
                                      
                    {day.booking_details ? (
                      <div className="flex justify-between items-center w-full">
                        <span>{day.booking_details.user_name}</span>
                        <span>{day.booking_details.yape}</span>
                        <span>{day.booking_details.price}</span>
                      </div>
                    ) : (
                      <div className="text-center">Disponible</div>
                    )}
                  </td>
                );
              })}
            </tr>
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
         {modalDataE &&isModalOpenE && (
       
       <ReservaEdit
         field={field}
         timeStart={modalDataE.timeStart}
         timeEnd={modalDataE.timeEnd}
         day={modalDataE.day}
         isOpen={isModalOpenE}
         onClose={handleCloseModalE}
         onSave={handleSaveReservationE}
          initialData={{
            booking_id: modalDataE.booking_id,
            user_id: modalDataE.user_id || "",
            yape: modalDataE.yape || 0,
            price:modalDataE.price || 0,
            sport_id:"1",
          }}
        />
      )}
    </div>
  );
}
