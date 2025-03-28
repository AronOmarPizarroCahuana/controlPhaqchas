import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Reservation, Day,BookingDetails } from './../Tabla/Reservation';
import { Table } from '@/components/ui/table';
import ReservaM from "../ReservaM/ReservaM";
import ReservaEdit from "../ReservaEdit/ReservaEdit";
import {API_URL} from "../../config";
import { Skeleton } from "@/components/ui/skeleton";
import Swal from "sweetalert2";

interface TablaProps {
  field: string;
  currentWeekStart: Date;
  startDate: string;
  endDate: string;
  id: string;

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

export default function Tabla({id, field, startDate, endDate, currentWeekStart, band, setband ,bookingid,setbookingid,userid,setuserid,cutCell,setCutCell,fieldid,setfieldid ,refreshTrigger,setRefreshTrigger}: TablaProps) {
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
  






  const [isCutting] = useState(false);
  const [cutBookingId, setCutBookingId] = useState<string | null>(null); // Guarda el ID de la reserva cortada

  useEffect(() => {
    console.log("🔄 Tabla recargada por cambio en refreshTrigger");
    fetchDatos(); // 🔄 Vuelve a obtener los datos
}, [refreshTrigger]); 


  const formatTime = (time: string) => {
    const date = new Date('1970-01-01 ' + time);  // Usar una fecha arbitraria para convertir la hora
    return date.toTimeString().substring(0, 5);   // Extraer la hora en formato 24 horas (HH:mm)
  };
  
  
  const [selectedCellcut, setSelectedCellcut] = useState<{ key: string; status: string; } | null>(null);

  

  const validStatuses = ["reservado", "en espera", "completado"];
  let touchTimeout: NodeJS.Timeout | null = null;

  const activateContextMenu = (x: number, y: number, cellKey: string, status: string, id: string, iduser: string) => {
    if (!validStatuses.includes(status)) return;
  
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
  
 /* useEffect(() => {
    setfieldid(""); // ✅ Ahora se ejecuta solo después del render
  }, []);*/

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
    console.log("⏳ Iniciando handleCutClick...")
    let contador = 0;

    console.log('Valor de selectedCellcut:', selectedCellcut);
    console.log('Valor de selectedCellcut:', cutBookingId);

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
      setband(false);
      setCutBookingId(null);
      setCutCell(null);
  
      console.log("🔄 Refrescando datos...");
      if (field !== fieldid) {
        console.log("🔄 Recargando tabla con fieldid:", fieldid);
        setRefreshTrigger(prev => prev + 1); // 🔄 Fuerza un re-render de la tabla
    }else{
     // fetchDatos()
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
    setCutCell(null)
  }}else{
    setband(false)
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

  // Verificar que 'day' sea un objeto Date válido
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
}, [reservations]);

function formatHour(time: string) {
    // Detecta si el tiempo está en formato de 12 horas AM/PM
    const [hour] = time.split(":");
    const ampm = time.includes("AM") || time.includes("PM") ? time.slice(-2) : ""; // AM/PM
    
    let hourNumber = parseInt(hour, 10); // Convierte la hora a número
  
    if (ampm === "PM" && hourNumber < 12) {
      hourNumber += 12; // Convertir a formato de 24 horas
    } else if (ampm === "AM" && hourNumber === 12) {
      hourNumber = 0; // Maneja el caso de la medianoche (12 AM)
    }
  
    return hourNumber; // Devuelve la hora en formato de 24 horas sin ceros iniciales
  }
  
  

  const getColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "disponible":
        return "bg-white text-black";
      case "reservado":
        return "bg-orange-500 text-white";
      case "en espera":
        return "bg-yellow-500 text-white";
      case "completado":
        return "bg-red-800 text-white";
      default:
        return "bg-gray-800 text-white";
    }
  };


  if (loading) 
   {
    return <div>
       <div className="w-full overflow-x-auto">
      <table className="w-full text-xs table-fixed border-collapse">
        <thead>
          <tr>
            <th className="w-[10%] p-1">
              <Skeleton className="h-3 w-full" />
            </th>
            <th className="w-[12%] p-1">
              <Skeleton className="h-3 w-full" />
            </th>
            {[...Array(5)].map((_, index) => (
              <th key={index} className="w-[15%] p-1">
                <Skeleton className="h-3 w-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(12)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-1">
                <Skeleton className="h-2 w-full" />
              </td>
              <td className="border p-1">
                <Skeleton className="h-2 w-full" />
              </td>
              {[...Array(5)].map((_, colIndex) => (
                <td key={colIndex} className="border p-1">
                  <Skeleton className="h-2 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
   }
  
  
  return (
    <div className="overflow-x-auto bg-neutra">
    <Table className=" w-full h-full text-sm  sm:min-w-[320px] table-fixed">
  <thead className="bg-gray-100">

  <tr>
  <th className="w-[10%]"></th>
  <th className="border bg-[#5A6BA0] font-inter text-white text-[5px] custom:text-[6px] w-[12%] p-1 h-auto leading-tight">
    Hora
  </th> 
  {days.map((day) => (
    <th
      key={day.toISOString()}
      className="border w-[15%] text-center font-inter leading-tight bg-[#8D9EC1] text-white text-[6px] custom:text-[7px]  h-auto"
    >
      <div>{format(day, "eeee", { locale: es })} {format(day, "d")}</div>
    </th>
  ))}
</tr>

   


  </thead>
  <tbody>
    {reservations.map((reservation, index) => (
      <tr key={index} >
        <td className="rotate-0 border leading-tight h-auto   font-bold font-inter text-center bg-white text-[#454545] text-[5px] custom:text-[6px]">
          CAMPO {field}
        </td>
        {reservation.hour_range && (
          <td className="border text-center text-[8px] leading-tight h-auto  font-semibold font-inter bg-white text-[#454545] custom:text-[9px] w-[15%]"> 
            {formatHour(reservation.hour_range.start)} - {formatHour(reservation.hour_range.end)}
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
              console.log("Estado actual - isCutting:", isCutting, "cutCell:", cutCell);
              console.log("bandera:",band);
              if (band==true) {
                console.log("Ejecutando handleCutClick para:", bookingid, "en celda:", cellKey);
                handleCutClick(reservation.hour_range.start,reservation.hour_range.end,day.day_name,day.status);
                setband(false); // Restablecer para permitir abrir el modal en el siguiente clic
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
            className={`border  leading-tight h-auto py-1 px-1 text-[8px] ${getColorClass(status)} 
              ${animatingCell === cellKey ? 'animate-colorAnimation' : ''} 
              ${(cutCell === cellKey && field === fieldid) ? "relative z-auto border-2 border-dashed border-blue-900 bg-[rgba(0,0,0,0.58)]" : ""}

            `}
          >
              {day.booking_details ? (
                <div className="flex justify-between items-center w-full">
                  {/* Show booking details */}
                </div>
              ) : (
                <div className="text-center">...</div>
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
