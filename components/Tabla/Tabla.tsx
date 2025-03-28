import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Reservation, Day,BookingDetails} from './Reservation';
import { Table } from '@/components/ui/table';
import ReservaM from "../ReservaM/ReservaM";
import ReservaEdit from "../ReservaEdit/ReservaEdit";
import {API_URL} from "../../config";
import {   TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Swal from "sweetalert2";

interface TablaProps {
  id: string;
  field: string;
  startDate: string;
  endDate: string;
  currentWeekStart: Date;
  band: boolean;
  setband: React.Dispatch<React.SetStateAction<boolean>>;
  bookingid: string ;
  setbookingid:React.Dispatch<React.SetStateAction<string>>;
  userid:string;
  setuserid:React.Dispatch<React.SetStateAction<string>>;
  cutCell: string | null;
  setCutCell: React.Dispatch<React.SetStateAction<string | null>>;
  fieldid:string;
  setfieldid:React.Dispatch<React.SetStateAction<string>>;
  refreshTrigger:number;
  setRefreshTrigger:React.Dispatch<React.SetStateAction<number>>;
}

export default function Tabla({ id, field, startDate, endDate, currentWeekStart, band, setband ,bookingid,setbookingid,userid,setuserid,cutCell,setCutCell,fieldid,setfieldid ,refreshTrigger,setRefreshTrigger}: TablaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    timeStart: string;
    timeEnd:string;
    day: Date;
    user_id?: string;
    yape?: number;
    sport_id?:string;

  } | null>(null);
  /*interface TargetCellData {
    startTime: string;
    endTime: string;
    day: Date;
  }*/
  
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
  //const [cutBookingId, setCutBookingId] = useState<string | null>(null); // Guarda el ID de la reserva cortada

  const formatTime = (time: string) => {
    const date = new Date('1970-01-01 ' + time);  // Usar una fecha arbitraria para convertir la hora
    return date.toTimeString().substring(0, 5);   // Extraer la hora en formato 24 horas (HH:mm)
  };
  
  
  const [selectedCellcut, setSelectedCellcut] = useState<{ key: string; status: string; } | null>(null);
  //const [isClient, setIsClient] = useState(false);

 
  const validStatuses = ["reservado", "en espera", "completado"];

  let touchTimeout: NodeJS.Timeout | null = null;

  const activateContextMenu = (x: number, y: number, cellKey: string, status: string, id: string, iduser: string) => {
    if (!validStatuses.includes(status)) return;
    console.log('Valor de selectedCellcut:', selectedCellcut);

    setband((prev) => {
      console.log("bandera cortar 3 antes de cambiar:", prev);
      return true;
    });
  
    setCutCell(cellKey);
    setfieldid(field);
    setuserid(iduser);
    setbookingid(id);
  
    setSelectedCellcut((prev) =>
      prev?.key === cellKey && prev.status === status ? prev : { key: cellKey, status }
    );
  
    setTimeout(() => {
      setband((prev) => {
        console.log("bandera cortar 3 actualizada:", prev);
        return prev;
      });
    }, 0);
  };
  
  const handleTouchStart = (event: React.TouchEvent, cellKey: string, status: string, id: string, iduser: string) => {
    const touch = event.touches[0];
  
    touchTimeout = setTimeout(() => {
      activateContextMenu(touch.clientX, touch.clientY, cellKey, status, id, iduser);
    }, 1000);
  };
  
  const handleTouchEnd = () => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      touchTimeout = null;
    }
  };
  
  const handleContextMenu = (event: React.MouseEvent, cellKey: string, status: string, id: string, iduser: string) => {
    event.preventDefault();
    activateContextMenu(event.clientX, event.clientY, cellKey, status, id, iduser);
  };
  

  const handleCutClick = async (hour_start: string, hour_end: string, targetDay: string ,status:string) => {
    if(status=="disponible"){
    const result = await Swal.fire({
      title: "¿Esta seguro que quiere mover la celda?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",

    });

    if (result.isConfirmed) {
    //console.log("⏳ Iniciando handleCutClick...")
    let contador = 0;


    //aca la condicion y que la tabla fieldid se reinicie
  
setCutCell(null)
    switch (targetDay) {
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
    const day=days[contador]
    console.log("📌 Datos recibidos:",status,bookingid,userid,targetDay,  hour_start, hour_end, day.toISOString().split('T')[0]);
  console.log("campo cortado",fieldid,"campo a pegar",field)
    if (band==false) {
      console.warn("⚠️ No hay reserva cortada, saliendo...");
      return;
    }
 
 
    // Datos para la API
    const requestData = {
      start_time: formatTime(hour_start),
      end_time: formatTime(hour_end),
      user_id:userid,
      booking_date: day.toISOString().split('T')[0],
      field_id: field,
    };
  
    console.log("📤 Enviando datos a la API:", requestData);
  
    try {
      const response = await fetch(`${API_URL}/booking/change/${bookingid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const responseData = await response.json();
      console.log("📥 Respuesta de la API:", responseData);
  
      if (!response.ok) {
        Swal.fire({ title: "ERROR", text: responseData.message, icon: "error" });
        setCutCell(null)
        setband(false)

        return;
      }
  
      console.log("✅ Reserva actualizada exitosamente.");
      setCutCell(null);
      setband((prev) => {
        console.log("bandera cortar 4", prev); // ✅ Esto imprimirá el valor antes de cambiarlo
        return false;
      });
      console.log("🔄 Refrescando datos...");
      if (field !== fieldid) {
        console.log("🔄 Recargando tabla con fieldid:", fieldid);
        setRefreshTrigger(prev => prev + 1); // 🔄 Fuerza un re-render de la tabla
    }else{

  setReservations((prev) => {
    const movedBooking: { details: BookingDetails | null; status: Day["status"] } = {
        details: null,
        status: "reservado",
    };

    return prev
        .map((reservation) => {
            const bookingIdNumber = Number(bookingid);
            console.log("📌 Buscando reserva con ID:", bookingIdNumber);

            // 1️⃣ Buscar la reserva y eliminarla del día original
            const updatedDays: Day[] = reservation.days.map((day) => {
                if (day.booking_details?.id === bookingIdNumber) {
                    console.log("✅ Reserva encontrada en el día:", day.day_name);

                    movedBooking.details = { ...day.booking_details };
                    movedBooking.status = day.status;

                    return { 
                        ...day, 
                        booking_details: null,  
                        status: "disponible",  
                    };
                }
                return day;
            });

            return { ...reservation, days: updatedDays };
        })
        .map((reservation) => {
            // 2️⃣ Insertar la reserva en el nuevo horario y día correctos
            if (
                reservation.hour_range.start === hour_start &&
                reservation.hour_range.end === hour_end &&
                movedBooking.details
            ) {
                return {
                    ...reservation,
                    days: reservation.days.map((day) =>
                        day.day_name === targetDay
                            ? {
                                  ...day,
                                  status: movedBooking.status,
                                  booking_details: movedBooking.details,
                              }
                            : day
                    ),
                };
            }
            return reservation;
        });
});


   }
    } catch (error) {
      console.error("❌ Error al actualizar la reserva:", error);
    }
  }
  else{
    setband(false)
    console.log("bandera cortar 5",band)

    setCutCell(null)
  }}else{
    setband(false)
    console.log("bandera cortar 6",band)

    setCutCell(null)
  }
  };
  
  
  
  

 

 

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
    console.log("reservacion",selectedDay)
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
    console.log("🚀 RefreshTrigger cambió, recargando datos...");
    fetchDatos(); // Llama a la función que obtiene los datos
}, [refreshTrigger]);

 

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
/*

useEffect(() => {
   // console.log("🔄 Estado actualizado:", reservations);
}, [reservations]);
*/

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

  const formattedStartTime = convertTo24HourFormat(timeStart);

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
/*
useEffect(() => {
   console.log("🔄 Estado actualizado: ","campo"+field, reservations);
}, [reservations]);
*/

  

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
    return  <div>
 <Table className="table-fixed w-full text-sm border-separate min-w-[1500px]">
  <TableBody>
    {Array.from({ length: 11 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell className="border p-4 text-center" colSpan={9}>
          <Skeleton className="h-6 w-full mx-auto" />
        </TableCell>
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
                const idbooking= `${day.booking_details?.id}`;
                const iduser= `${day.booking_details?.id_user}`;

                return (
                  <td
                  key={dayIndex}
                  onContextMenu={(e) => handleContextMenu(e, cellKey, status,idbooking,iduser)} // Convertir a string
                  onTouchEnd={handleTouchEnd} // Aquí cancelamos si suelta antes de 2 segundos

                  onTouchStart={(e) => handleTouchStart(e, cellKey, status,idbooking,iduser)}
                  onClick={() => {
                    console.log("Click en celda:", cellKey);
                    console.log("bandera cortar 1",band);
                    if (band==true) {
                      console.log("Ejecutando handleCutClick para:", bookingid, "en celda:", cellKey);
                      handleCutClick(reservation.hour_range.start,reservation.hour_range.end,day.day_name,day.status);
                      console.log("bandera cortar 2",band)
                      return; // Evita que se ejecute el código del modal
                    }
                   else{
                    const selectedDay = reservation.days.find(d => d.day_name === day.day_name);
                    if (selectedDay) {
                      console.log("Ejecutando handleCellClick, abriendo modal");
                      handleCellClick(
                        reservation.hour_range.start,
                        reservation.hour_range.end,
                        day.day_name,
                        selectedDay,
                        status
                      );
                    }
                  }
                }}
                  className={`border px-4 py-2 text-xs ${getColorClass(status)} 
                    ${animatingCell === cellKey ? 'animate-colorAnimation' : ''} 
                    ${(cutCell === cellKey && field === fieldid) ? "outline outline-2 outline-blue-900" : ""}

                  `}
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
