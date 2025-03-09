'use client';

import { useState } from 'react';
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Tabla from '../Tabla-zoom/Tabla-zoom';
import Link from "next/link";

const fields = ['1', '2', '3', '4'] as const;

export default function Booking() {
  // Un único estado para manejar la semana de todas las canchas
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // Manejadores de la semana anterior y siguiente
  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  const getStartDateForWeek = (weekStart: Date) => format(weekStart, 'yyyy-MM-dd');
  const getEndDateForWeek = (weekStart: Date) => format(addDays(weekStart, 6), 'yyyy-MM-dd');

  const startDate = getStartDateForWeek(currentWeekStart);
  const endDate = getEndDateForWeek(currentWeekStart);

  return (
    <div className="p-1 bg-[#EFEFEF] rounded-lg shadow-lg sm:space-y-4">
     <div className="fixed bottom-5 left-1/2 top-1 -translate-x-1/2 z-50 sm:hidden">
  <Link
    href="/AdminGestion/Reserva"
    className="bg-blue-600 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 transition flex items-center justify-center w-11 h-11"
  >
    <i className="fas fa-search-plus text-xl"></i>
  </Link>
</div>

      {/* Controles de navegación para todas las canchas */}
      
<div className="flex justify-between items-center w-full  bg-white h-[19px] fixed -mt-[4px] z-40 shadow-md">
  <button
    className="bg-blue-600 text-white px-5 h-[19px] py-1 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center"
    onClick={handlePreviousWeek}
  >
    <span className="hidden sm:inline">Semana Anterior</span>
    <span className="sm:hidden">
      <i className="fas fa-chevron-left text-[9px]"></i>
    </span>
  </button>

  <h2 className="text-[9px] font-semibold text-center flex-grow text-gray-700">
    {format(currentWeekStart, 'MMMM yyyy', { locale: es }).toUpperCase()}
  </h2>

  <button
    className="bg-blue-600 text-white px-5 h-[19px] py-1 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center"
    onClick={handleNextWeek}
  >
    <span className="hidden sm:inline">Siguiente Semana</span>
    <span className="sm:hidden">
      <i className="fas fa-chevron-right text-[9px]"></i>
    </span>
  </button>
</div>




      <div className="mt-4">
        {fields.map((field) => (
          <Tabla key={field} id={field} field={field} startDate={startDate} endDate={endDate} currentWeekStart={currentWeekStart} />
        ))}
      </div>
    </div>
  );
}

