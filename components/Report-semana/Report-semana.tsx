'use client';

import { useState } from 'react';
import { format, startOfWeek, addWeeks, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import Tablareserva from '../Tabla-report-semana/Tabla-report-semana';

const fields = ['1', '2', '3', '4']; // Identificadores de las canchas
const weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']; // Pestañas de semanas

export default function Booking() {
  const [selectedWeek, setSelectedWeek] = useState(2); // Semana actual seleccionada por defecto (índice 2)
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const handleWeekChange = (index: number) => {
    setSelectedWeek(index);

    // Ajustar la fecha de inicio según la semana seleccionada
    const weekOffset = index - 2; // Semana actual es la tercera semana
    setCurrentWeekStart(addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset));
  };

  const startDate = format(currentWeekStart, 'yyyy-MM-dd');
  const endDate = format(addDays(currentWeekStart, 6), 'yyyy-MM-dd');
  const monthYear = format(currentWeekStart, 'MMMM yyyy', { locale: es }).toUpperCase(); // Mes y año en español, en mayúsculas

  const handleExportPDF = () => {
    console.log('Exportar a PDF');
  };

  const handleExportExcel = () => {
    console.log('Exportar a Excel');
  };

  return (
    <div className="p-6 bg-[#EFEFEF] rounded-lg shadow-lg space-y-8">
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field}>
            <div className="text-center text-2xl font-bold text-gray-800 mb-4">
        {monthYear}
      </div>
            <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1">
          {weeks.map((week, index) => (
            <button
              key={index}
              onClick={() => handleWeekChange(index)}
              className={`px-8 py-3 text-white font-semibold transition relative ${
                selectedWeek === index
                  ? 'bg-green-600 shadow-md' 
                  : 'bg-gray-400 hover:bg-green-400' 
              }`}
              style={{
                transform: 'skewX(-20deg)', 
              }}
            >
              <span style={{ transform: 'skewX(10deg)' }}>{week}</span> {/* Corregir inclinación del texto */}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-[#F5CE04] text-white rounded-md hover:bg-[#C7AD29] transition font-semibold"
          >
            Exportar a PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-[#39CF43] text-white rounded-md hover:bg-[#30a037] transition font-semibold"
          >
            Exportar a Excel
          </button>
        </div>
      </div>
            <Tablareserva
              id={field}
              field={field}
              startDate={startDate}
              endDate={endDate}
              currentWeekStart={currentWeekStart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
