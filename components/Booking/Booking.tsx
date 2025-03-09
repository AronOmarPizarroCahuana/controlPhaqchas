'use client';

import { useState } from 'react';
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Tabla from '../Tabla/Tabla';
import TablaTop from '../TablaTop/TablaTop';
import Link from 'next/link';

// Definimos el tipo de 'fields'
const fields = ['1', '2', '3', '4'] as const;

// Definimos el tipo de 'weekStartDates' para que sea un objeto que tiene como claves los elementos de 'fields' y como valores fechas
type WeekStartDates = {
  [key in typeof fields[number]]: Date;
};

export default function Booking() {
  // Creamos un estado para cada semana, uno por cada campo
  const initialState: WeekStartDates = fields.reduce((acc, field) => {
    acc[field] = startOfWeek(new Date(), { weekStartsOn: 1 });
    return acc;
  }, {} as WeekStartDates);

  const [weekStartDates, setWeekStartDates] = useState<WeekStartDates>(initialState);

  // Manejadores de la semana anterior y siguiente para cada campo
  const handlePreviousWeek = (field: keyof WeekStartDates) => {
    setWeekStartDates((prev) => ({
      ...prev,
      [field]: subWeeks(prev[field], 1),
    }));
  };

  const handleNextWeek = (field: keyof WeekStartDates) => {
    setWeekStartDates((prev) => ({
      ...prev,
      [field]: addWeeks(prev[field], 1),
    }));
  };

  const getStartDateForWeek = (weekStart: Date) => format(weekStart, 'yyyy-MM-dd');
  const getEndDateForWeek = (weekStart: Date) => format(addDays(weekStart, 6), 'yyyy-MM-dd');

  return (
    <div className="py-[1px] px-[6px] sm:p-3 bg-[#EFEFEF] rounded-lg shadow-lg  ">
      
      <div className="space-y-4">
      <div className="fixed bottom-5 left-1/2 top-1 -translate-x-1/2 z-50 sm:hidden">
  <Link
    href="/AdminGestion/Reserva-zoom"
    className="bg-blue-600 text-white p-4 rounded-lg shadow-lg hover:bg-blue-700 transition flex items-center justify-center w-11 h-11"
  >
    <i className="fas fa-search-plus text-xl"></i>
  </Link>
</div>
        {fields.map((field) => {
          const currentWeekStart = weekStartDates[field];
          const startDate = getStartDateForWeek(currentWeekStart);
          const endDate = getEndDateForWeek(currentWeekStart);

          return (
            <div key={field}>
 <div className="flex justify-between items-center bg-white ">
  <button
    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center sm:space-x-2 space-x-0"
    onClick={() => handlePreviousWeek(field)}
  >
    <span className="hidden sm:inline">Semana Anterior</span>
    <span className="sm:hidden">
      <i className="fas fa-chevron-left w-5 h-5"></i>
    </span>
  </button>

  <h2 className="text-xl font-semibold text-center flex-grow text-gray-700">
    {format(currentWeekStart, 'MMMM yyyy', { locale: es }).toUpperCase()}
  </h2>

  <button
    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center sm:space-x-2 space-x-0"
    onClick={() => handleNextWeek(field)}
  >
    <span className="hidden sm:inline">Siguiente Semana</span>
    <span className="sm:hidden">
      <i className="fas fa-chevron-right w-5 h-5"></i>
    </span>
  </button>
</div>




              <TablaTop />
              <Tabla id={field} field={field} startDate={startDate} endDate={endDate} currentWeekStart={currentWeekStart} />
            </div>
            
          );
        })}
      </div>
      </div>
  );
}
